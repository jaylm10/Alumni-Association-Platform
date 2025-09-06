const mongoose = require('mongoose');

// A sub-schema for student projects, which are their "work experience"
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  technologies: [String], // e.g., ['React', 'Node.js', 'MongoDB']
  link: { // Link to GitHub, live demo, etc.
    type: String,
    trim: true
  }
}, { _id: false });

const studentProfileSchema = new mongoose.Schema({
  // Link to the main user account. This is the most important field.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'register', // Must match the name of your user model
    required: true,
    unique: true // Each user can only have one student profile
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required.'],
    trim: true
  },
  profilePictureUrl: {
    type: String,
    default: 'https://via.placeholder.com/150?text=Student',
  },
  // --- STUDENT-SPECIFIC FIELDS ---
  major: {
    type: String,
    required: [true, 'Major or field of study is required.'],
    trim: true
  },
  expectedGraduationYear: {
    type: Number,
    required: [true, 'Expected graduation year is required.']
  },
  resumeUrl: { // Link to a PDF resume (e.g., stored on Cloudinary or S3)
    type: String,
    trim: true
  },
  // Array of projects using the sub-schema
  projects: [projectSchema],

  // --- CAREER GOALS ---
  careerInterests: {
    type: [String], // e.g., ['Software Development', 'Data Science']
    default: []
  },
  seeking: {
    type: [String], // e.g., ['Internship', 'Mentorship', 'Full-time Job']
    default: []
  },
  // --- COMMON FIELDS ---
  skills: {
    type: [String],
    default: []
  },
  contact: { // Re-using a similar structure to the alumni profile
    email: String,
    linkedin: String,
    github: String,
    website: String,
  },
   connectionSettings: {
    isAcceptingMessages: {
      type: Boolean,
      default: true // Opt-in by default
    },
    isAcceptingMeetings: {
      type: Boolean,
      default: true // Opt-in by default
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);