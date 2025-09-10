const mongoose = require('mongoose');

// Sub-schema for speakers to keep the main schema clean
const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
  bio: { type: String, trim: true }
}, { _id: false });

// Sub-schema for the event agenda
const agendaItemSchema = new mongoose.Schema({
  time: { type: String, required: true, trim: true },
  activity: { type: String, required: true, trim: true }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required.'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Event date is required.'],
  },
  timeStart: { type: String, required: true },
  timeEnd: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  locationType: {
    type: String,
    enum: ['in-person', 'online'],
    required: true,
  },
  type: { // e.g., Networking, Reunion, Workshop
    type: String,
    required: true,
    trim: true,
  },
  description: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true, trim: true },
  organizer: { type: String, required: true, trim: true }, // Can be pre-filled with user's name
  imageUrl: { type: String, trim: true },
  isFeatured: { type: Boolean, default: false },
  
  // --- IMPORTANT FIELDS FOR DYNAMIC FUNCTIONALITY ---
  
  // Tracks who created the event. This is CRITICAL for delete permissions.
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'register', // Must match your User model name
    required: true,
  },
  
  // Stores a list of users who have registered for the event.
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'register',
  }],
  capacity: { type: Number, default: 0 },

  // --- ARRAYS OF SUB-SCHEMAS ---
  speakers: [speakerSchema],
  agenda: [agendaItemSchema],
  // Comments will be a separate model later if needed, to keep this lean.

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Event', eventSchema);
