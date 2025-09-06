const express = require('express');
const router = express.Router();
const { getAlumniProfile, createOrUpdateAlumniProfile,getAllAlumniProfiles,getProfileById } = require('../controller/alumniProfileController');
const authMiddleware = require('../middleware/auth'); 
const upload = require("../middleware/upload")

router.get('/me', authMiddleware, getAlumniProfile);
router.post('/', authMiddleware,upload, createOrUpdateAlumniProfile);
router.get('/all', authMiddleware, getAllAlumniProfiles);
router.get('/:id', authMiddleware, getProfileById);

module.exports = router;
