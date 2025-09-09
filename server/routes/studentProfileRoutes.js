const express = require('express');
const router = express.Router();

// --- IMPORTANT ---
// Import the STUDENT controller and the NEW upload middleware
const { getStudentProfile, createOrUpdateStudentProfile,getAllStudentProfiles  } = require('../controller/studentProfileController');
const uploadStudentFiles = require('../middleware/uploadStudentFiles');

// Standard middleware
const authMiddleware = require('../middleware/auth');

// --- ROUTES ---

// @route   GET /api/student-profile/me
// @desc    Get current student's profile
// @access  Private
router.get('/me', authMiddleware, getStudentProfile);

// @route   POST /api/student-profile
// @desc    Create or update student profile
// @access  Private
// This route now uses the middleware that handles both picture and resume uploads
router.post('/', authMiddleware, uploadStudentFiles, createOrUpdateStudentProfile);

router.get("/all", authMiddleware, getAllStudentProfiles)

module.exports = router;