import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task payload tracking title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed maximum data constraints of 120 chars']
  },
  desc: {
    type: String,
    default: 'No descriptive specification logs attached to this node index.'
  },
  status: {
    type: String,
    enum: ['backlog', 'todo', 'in-progress', 'done'],
    default: 'backlog'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task entities must map to a valid origin engineer account']
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);