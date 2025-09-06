const StudentProfile = require('../models/studentProfile');

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

  // --- HANDLE FILE URLS FROM req.files ---
  // req.files will be an object like: { profilePicture: [file], resume: [file] }
  
  // Handle Profile Picture
  if (req.files && req.files.profilePicture) {
    const file = req.files.profilePicture[0];
    const filePath = file.path.replace(/\\/g, "/").substring("public/".length);
    profileFields.profilePictureUrl = `${process.env.SERVER_URL}/${filePath}`;
  } else if (req.body.profilePictureUrl) {
    profileFields.profilePictureUrl = req.body.profilePictureUrl;
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
    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error saving student profile:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};