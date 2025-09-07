const mongoose = require('mongoose');

// --- Sub-Schema for Contact Information ---
const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
    match: [/(https?)?:?(\/\/)?|([a-z0-9-]+\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/, 'Please fill a valid LinkedIn profile URL']
  },
  github: {
    type: String,
    trim: true,
    match: [/(https?)?:?(\/\/)?|([a-z0-9-]+\.)?github\.com\/[a-zA-Z0-9_-]+/, 'Please fill a valid GitHub profile URL']
  },
  website: {
    type: String,
    trim: true,
  }
}, { _id: false });


// --- Sub-Schema for Education History ---
const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: [true, 'Degree is required.'],
    trim: true,
  },
  institution: {
    type: String,
    required: [true, 'Institution is required.'],
    trim: true,
  },
  field: {
    type: String,
    required: [true, 'Field of study is required.'],
    trim: true,
  },
  year: {
    type: String,
    required: [true, 'Year of graduation or study period is required.'],
    trim: true,
  }
});


// --- Main Alumni Profile Schema ---
const alumniProfileSchema = new mongoose.Schema({
  // Link to the user who owns this profile
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'register',
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required.'],
    trim: true,
    maxlength: 100,
  },
  profilePictureUrl: {
    type: String,
    default: 'https://via.placeholder.com/150?text=User',
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  currentCompany: {
    type: String,
    trim: true,
  },
  currentPosition: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  education: [educationSchema],
  skills: {
    type: [String],
    set: (skills) => skills.map(skill => skill.trim()),
  },
  contact: contactSchema,

  // --- CORRECT PLACEMENT FOR connectionSettings ---
  // It must be inside this main object with all the other fields.
  connectionSettings: {
    isAcceptingMessages: {
      type: Boolean,
      default: true
    },
    isAcceptingMeetings: {
      type: Boolean,
      default: true
    }
  },
  
}, { // This is the second argument, for options like timestamps.
  timestamps: true,
});

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);
