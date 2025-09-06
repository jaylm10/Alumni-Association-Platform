const mongoose = require('mongoose');

// --- Sub-Schema for Contact Information ---
// Corresponds to the `contact` object in your state
const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    // Regex for basic email validation
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
    // Regex to validate a LinkedIn profile URL
    match: [/(https?)?:?(\/\/)?|([a-z0-9-]+\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/, 'Please fill a valid LinkedIn profile URL']
  },
  github: {
    type: String,
    trim: true,
    // Regex to validate a GitHub profile URL
    match: [/(https?)?:?(\/\/)?|([a-z0-9-]+\.)?github\.com\/[a-zA-Z0-9_-]+/, 'Please fill a valid GitHub profile URL']
  },
  website: {
    type: String,
    trim: true,
  }
}, { _id: false }); // _id: false prevents MongoDB from creating an _id for the sub-document


// --- Sub-Schema for Education History ---
// Corresponds to the objects inside the `education` array in your state
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
    type: String, // String is flexible for ranges like "2018-2022"
    required: [true, 'Year of graduation or study period is required.'],
    trim: true,
  }
});


// --- Main Alumni Profile Schema ---
const alumniProfileSchema = new mongoose.Schema({
  // Link to the user who owns this profile. Assumes your user model is named 'register'.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'register',
    required: true,
    unique: true, // Each user can only have one profile
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required.'],
    trim: true,
    maxlength: 100,
  },
  profilePictureUrl: {
    type: String,
    // A default avatar for users who haven't uploaded a picture
    default: 'https://via.placeholder.com/150?text=User',
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 1000, // Limit the bio length
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
  // Array of education documents using the sub-schema
  education: [educationSchema],

  // Array of strings for skills
  skills: {
    type: [String],
    // Ensure each skill is trimmed
    set: (skills) => skills.map(skill => skill.trim()),
  },
  // Nested object for contact details using the sub-schema
  contact: contactSchema,
}, {
  // Automatically add createdAt and updatedAt fields
  timestamps: true,
});

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);