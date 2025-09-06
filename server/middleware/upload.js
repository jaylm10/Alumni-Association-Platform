const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  // Destination for files
  destination: './public/uploads/profile-pictures',
  // Filename to use
  filename: (req, file, cb) => {
    // Create a unique filename to avoid conflicts
    // Format: fieldname-timestamp.extension
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('profilePicture'); // 'profilePicture' must match the field name from the frontend FormData

module.exports = upload;
