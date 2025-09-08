const StudentProfile = require('../models/studentProfile');
const User = require("../models/user")

/**
 * @desc    Get the profile of the currently logged-in student
 * @route   GET /api/student-profile/me
 * @access  Private
 */
exports.getStudentProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id })
      .populate('user', ['name', 'email']);

    if (!profile) {
      return res.status(404).json({ message: 'No profile found for this student.' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Create or update a student profile
 * @route   POST /api/student-profile
 * @access  Private
 */
exports.createOrUpdateStudentProfile = async (req, res) => {
  const { fullName, major, expectedGraduationYear } = req.body;
  
  const projects = JSON.parse(req.body.projects || '[]');
  const skills = JSON.parse(req.body.skills || '[]');
  const careerInterests = JSON.parse(req.body.careerInterests || '[]');
  const seeking = JSON.parse(req.body.seeking || '[]');
  const contact = JSON.parse(req.body.contact || '{}');

  const profileFields = { user: req.user.id };

  // Assign text fields
  if (fullName) profileFields.fullName = fullName;
  if (major) profileFields.major = major;
  if (expectedGraduationYear) profileFields.expectedGraduationYear = expectedGraduationYear;
  if (projects) profileFields.projects = projects;
  if (skills) profileFields.skills = skills;
  if (careerInterests) profileFields.careerInterests = careerInterests;
  if (seeking) profileFields.seeking = seeking;
  if (contact) profileFields.contact = contact;

  // --- 2. LOGIC TO CAPTURE THE URL FOR SYNCING ---
  let pictureUrlToSync; // Variable to hold the URL

  // Handle Profile Picture
  if (req.files && req.files.profilePicture) {
    const file = req.files.profilePicture[0];
    const filePath = file.path.replace(/\\/g, "/").substring("public/".length);
    profileFields.profilePictureUrl = `${process.env.SERVER_URL}/${filePath}`;
    pictureUrlToSync = profileFields.profilePictureUrl; // Capture the new URL
  } else if (req.body.profilePictureUrl) {
    profileFields.profilePictureUrl = req.body.profilePictureUrl;
    pictureUrlToSync = req.body.profilePictureUrl; // Capture the existing URL
  }

  // Handle Resume
  if (req.files && req.files.resume) {
    const file = req.files.resume[0];
    const filePath = file.path.replace(/\\/g, "/").substring("public/".length);
    profileFields.resumeUrl = `${process.env.SERVER_URL}/${filePath}`;
  } else if (req.body.resumeUrl) {
    profileFields.resumeUrl = req.body.resumeUrl;
  }

  try {
    // 3. Save the main student profile first
    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    // --- 4. SYNC THE PICTURE URL TO THE MAIN USER MODEL ---
    if (pictureUrlToSync) {
      await User.findByIdAndUpdate(req.user.id, { profilePictureUrl: pictureUrlToSync });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error saving student profile:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};