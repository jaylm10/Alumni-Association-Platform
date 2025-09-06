const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories if they don't exist
const pictureDir = './public/uploads/profile-pictures';
const resumeDir = './public/uploads/resumes';
if (!fs.existsSync(pictureDir)) fs.mkdirSync(pictureDir, { recursive: true });
if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files to different folders based on their field name
    if (file.fieldname === 'profilePicture') {
      cb(null, pictureDir);
    } else if (file.fieldname === 'resume') {
      cb(null, resumeDir);
    } else {
      cb(new Error('Invalid file field'), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

function checkFileType(file, cb) {
  // Allow images for profile picture
  if (file.fieldname === "profilePicture") {
    if (file.mimetype.startsWith('image')) {
      return cb(null, true);
    } else {
      return cb('Error: Profile pictures must be image files!');
    }
  }
  // Allow PDFs for resume
  if (file.fieldname === "resume") {
    if (file.mimetype === 'application/pdf') {
      return cb(null, true);
    } else {
      return cb('Error: Resumes must be PDF files!');
    }
  }
}

// Use .fields() to accept multiple files with different field names
const uploadStudentFiles = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit per file
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]);

module.exports = uploadStudentFiles;