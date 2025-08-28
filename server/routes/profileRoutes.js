const express = require('express');
const router = express.Router();
const { getAlumniProfile, createOrUpdateAlumniProfile } = require('../controller/alumniProfileController');
const authMiddleware = require('../middleware/auth'); 
const upload = require("../middleware/upload")

router.get('/me', authMiddleware, getAlumniProfile);
router.post('/', authMiddleware,upload, createOrUpdateAlumniProfile);

module.exports = router;
