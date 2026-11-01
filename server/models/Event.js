const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide event description']
    },
    venue: {
      type: String,
      required: [true, 'Please provide event venue / location'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Please provide the event date']
    },
    time: {
      type: String,
      required: [true, 'Please provide event time (e.g. 10:00 AM)'],
      trim: true
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify maximum capacity'],
      min: [1, 'Capacity must be at least 1']
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: {
        values: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        message: 'Invalid event status'
      },
      default: 'upcoming'
    }
  },
  {
    timestamps: true
  }
);

// Indexes on date and status as requested
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema);

