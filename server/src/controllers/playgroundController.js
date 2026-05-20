import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';

const prisma = new PrismaClient();

// Initialize Google Gen AI client matching official SDK specifications
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Fetch all code sandboxes assigned to a specific project workspace
 */
export const getProjectPlaygrounds = async (req, res) => {
  try {
    const { projectId } = req.params;

    const playgrounds = await prisma.codePlayground.findMany({
      where: { projectId },
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return res.status(200).json({ success: true, playgrounds });
  } catch (error) {
    console.error('Error fetching playgrounds:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch playground environments.' });
  }
};

/**
 * Persist or update a collaborative code snippet canvas
 */
export const upsertPlaygroundSnippet = async (req, res) => {
  try {
    const { id, title, code, language, projectId } = req.body;
    const userId = req.user.id; // Populated by your JWT auth middleware

    if (!title || !projectId) {
      return res.status(400).json({ success: false, message: 'Missing essential title or project references.' });
    }

    let playground;

    if (id) {
      // Update existing sandbox block
      playground = await prisma.codePlayground.update({
        where: { id },
        data: { title, code, language }
      });
    } else {
      // Create new playground environment
      playground = await prisma.codePlayground.create({
        data: {
          title,
          code: code || '',
          language: language || 'javascript',
          projectId,
          createdById: userId
        }
      });
    }

    return res.status(200).json({ success: true, playground });
  } catch (error) {
    console.error('Error saving snippet:', error);
    return res.status(500).json({ success: false, message: 'Failed to process playground snippet update.' });
  }
};

/**
 * Execute a real-time Gemini AI review of the active sandbox source code
 */
export const analyzeSnippetWithAI = async (req, res) => {
  try {
    const { id } = req.params;

    const playground = await prisma.codePlayground.findUnique({
      where: { id }
    });

    if (!playground) {
      return res.status(404).json({ success: false, message: 'Playground instance not found.' });
    }

    if (!playground.code || playground.code.trim() === '') {
      return res.status(400).json({ success: false, message: 'Code canvas is blank. Please write or paste code before analysis.' });
    }

    // Build specialized engineering context prompt layout
    const analysisPrompt = `
      You are an expert software engineer and systems architect. Inspect the following snippet carefully.
      
      Language Environment: ${playground.language}
      Code Content:
      \`\`\`${playground.language}
      ${playground.code}
      \`\`\`

      Provide a comprehensive code review focusing on:
      1. **Security Vulnerabilities** (unvalidated inputs, dependency flaws, data leaks)
      2. **Logical Edge-Cases & Bugs** (race conditions, null pointers, unbounded arrays)
      3. **Performance Optimization Metrics** (time/space complexity, resource leaks)
      
      Structure your review using clear Markdown sections. Be concrete, concise, and direct. Do not write generic advice—point out specific lines or patterns if they apply.
    `;

    // Execute generation with recommended gemini-2.5-flash model
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: analysisPrompt
    });

    const reportText = aiResponse.text;

    // Cache metrics directly inside database record instance
    const updatedPlayground = await prisma.codePlayground.update({
      where: { id },
      data: {
        aiReviewCache: reportText,
        lastAnalyzedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      aiReview: reportText,
      lastAnalyzedAt: updatedPlayground.lastAnalyzedAt
    });
  } catch (error) {
    console.error('Gemini playground analysis engine error:', error);
    return res.status(500).json({ success: false, message: 'AI evaluation failed to compile successfully.' });
  }
};