const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a notice title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide notice content/description']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: {
        values: ['academic', 'administrative', 'sports', 'cultural', 'general'],
        message: 'Invalid notice category'
      },
      default: 'general'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high'
      },
      default: 'medium'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    expiryDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes on category and createdAt for optimized search & filtering
noticeSchema.index({ category: 1 });
noticeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notice', noticeSchema);

