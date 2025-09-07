const AlumniProfile  = require('../models/alumniProfile')

exports.getAlumniProfile = async (req, res) => {
  try {
    // req.user.id is attached by the authMiddleware after verifying the token
    const profile = await AlumniProfile.findOne({ user: req.user.id })
      .populate('user', ['name', 'email']); // Populate with user's name and email from the 'register' model

    // Check if a profile exists for this user
    if (!profile) {
      return res.status(404).json({ message: 'No profile found for this user. Please create one.' });
    }

    // If profile exists, send it
    res.status(200).json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error('Error fetching alumni profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not fetch profile.',
      error: error.message,
    });
  }
};


exports.createOrUpdateAlumniProfile = async (req, res) => {
  // --- This part is from your working code ---
  const {
    fullName,
    bio,
    currentCompany,
    currentPosition,
    location,
  } = req.body;
  
  // Parse stringified fields from FormData, just like you were doing
  const contact = JSON.parse(req.body.contact || '{}');
  const education = JSON.parse(req.body.education || '[]');
  const skills = JSON.parse(req.body.skills || '[]');
  
  // --- NEW: Parse the connectionSettings field in the same way ---
  const connectionSettings = JSON.parse(req.body.connectionSettings || '{}');

  const profileFields = { user: req.user.id };

  // Handle the profile picture URL
  if (req.file) {
    const filePath = req.file.path.replace(/\\/g, "/").substring("public/".length);
    profileFields.profilePictureUrl = `${process.env.SERVER_URL}/${filePath}`;
  } else if (req.body.profilePictureUrl) {
    profileFields.profilePictureUrl = req.body.profilePictureUrl;
  }

  // Build the rest of the profile object
  if (fullName) profileFields.fullName = fullName;
  if (bio) profileFields.bio = bio;
  if (currentCompany) profileFields.currentCompany = currentCompany;
  if (currentPosition) profileFields.currentPosition = currentPosition;
  if (location) profileFields.location = location;
  if (contact) profileFields.contact = contact;
  if (education) profileFields.education = education;
  if (skills) profileFields.skills = skills;
  
  // --- NEW: Add the parsed settings to the object to be saved ---
  if (connectionSettings) profileFields.connectionSettings = connectionSettings;

  try {
    const profile = await AlumniProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Profile saved successfully.',
      profile,
    });
  } catch (error) {
    console.error('Error saving alumni profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not save profile.',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all alumni profiles
 * @route   GET /api/profile/all
 * @access  Private (only logged-in users can see)
 */
exports.getAllAlumniProfiles = async (req, res) => {
  try {
    // We fetch AlumniProfile, not the 'register' model
    const alumniProfiles = await AlumniProfile.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alumniProfiles.length,
      profiles: alumniProfiles,
    });
  } catch (error) {
    console.error('Error fetching all alumni profiles:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Get a single alumni profile by its ID
 * @route   GET /api/profile/:id
 * @access  Private (only logged-in users can view profiles)
 */
exports.getProfileById = async (req, res) => {
  try {
    const profile = await AlumniProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Alumni profile not found.' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching profile by ID:', error);
    // If the ID format is invalid, Mongoose throws an error
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ success: false, message: 'Alumni profile not found.' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

