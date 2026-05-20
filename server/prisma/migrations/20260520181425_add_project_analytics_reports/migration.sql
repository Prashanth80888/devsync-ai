-- CreateTable
CREATE TABLE "CodePlayground" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'javascript',
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "aiReviewCache" TEXT,
    "lastAnalyzedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodePlayground_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsReport" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "generatedById" TEXT NOT NULL,
    "totalTasks" INTEGER NOT NULL DEFAULT 0,
    "completedTasks" INTEGER NOT NULL DEFAULT 0,
    "pendingTasks" INTEGER NOT NULL DEFAULT 0,
    "backlogTasks" INTEGER NOT NULL DEFAULT 0,
    "velocityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "playgroundCount" INTEGER NOT NULL DEFAULT 0,
    "criticalSecurityWarnings" INTEGER NOT NULL DEFAULT 0,
    "executiveSummary" TEXT NOT NULL,
    "bottleneckAnalysis" TEXT NOT NULL,
    "recommendedActions" TEXT[],
    "projectHealthRating" TEXT NOT NULL DEFAULT 'STABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodePlayground_projectId_idx" ON "CodePlayground"("projectId");

-- CreateIndex
CREATE INDEX "CodePlayground_createdById_idx" ON "CodePlayground"("createdById");

-- CreateIndex
CREATE INDEX "AnalyticsReport_projectId_idx" ON "AnalyticsReport"("projectId");

-- CreateIndex
CREATE INDEX "AnalyticsReport_projectId_createdAt_idx" ON "AnalyticsReport"("projectId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "CodePlayground" ADD CONSTRAINT "CodePlayground_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodePlayground" ADD CONSTRAINT "CodePlayground_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsReport" ADD CONSTRAINT "AnalyticsReport_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsReport" ADD CONSTRAINT "AnalyticsReport_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
