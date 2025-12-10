const AlumniProfile  = require('../models/alumniProfile')
const User = require('../models/user')

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
  // 1. Parse all fields from FormData
  const {
    fullName,
    bio,
    currentCompany,
    currentPosition,
    location,
  } = req.body;
  
  const contact = JSON.parse(req.body.contact || '{}');
  const education = JSON.parse(req.body.education || '[]');
  const skills = JSON.parse(req.body.skills || '[]');
  const connectionSettings = JSON.parse(req.body.connectionSettings || '{}');

  const profileFields = { user: req.user.id };

  // 2. Handle file upload and URL construction
  let pictureUrlToSync;
  if (req.file) {
    const filePath = req.file.path.replace(/\\/g, "/").substring("public/".length);
    profileFields.profilePictureUrl = `${process.env.SERVER_URL}/${filePath}`;
    pictureUrlToSync = profileFields.profilePictureUrl;
  } else if (req.body.profilePictureUrl) {
    profileFields.profilePictureUrl = req.body.profilePictureUrl;
    pictureUrlToSync = req.body.profilePictureUrl;
  }
  
  // 3. Build the complete profile object
  if (fullName) profileFields.fullName = fullName;
  if (bio) profileFields.bio = bio;
  if (currentCompany) profileFields.currentCompany = currentCompany;
  if (currentPosition) profileFields.currentPosition = currentPosition;
  if (location) profileFields.location = location;
  if (contact) profileFields.contact = contact;
  if (education) profileFields.education = education;
  if (skills) profileFields.skills = skills;
  if (connectionSettings) profileFields.connectionSettings = connectionSettings;

  try {
    // 4. Save to AlumniProfile model
    const profile = await AlumniProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    // 5. Sync picture URL to the main User model
    if (pictureUrlToSync) {
      await User.findByIdAndUpdate(req.user.id, { profilePictureUrl: pictureUrlToSync });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error('Error saving alumni profile:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Get all alumni profiles
 * @route   GET /api/profile/all
 * @access  Private (only logged-in users can see)
 */
exports.getAllAlumniProfiles = async (req, res) => {
  try {
    // Get the logged-in user's ID from the token (provided by authMiddleware)
    const loggedInUserId = req.user.id;

    // --- THIS IS THE KEY CHANGE ---
    // Modify the query to find all profiles where the 'user' field
    // is "not equal to" ($ne) the loggedInUserId.
    const alumniProfiles = await AlumniProfile.find({
      user: { $ne: loggedInUserId }
    }).sort({ createdAt: -1 });
    // --- END OF CHANGE ---

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

exports.getFeaturedAlumni = async (req, res) => {
  try {
    // Fetch 4 profiles, sorted by creation date or any other criteria
    // We select specific fields to optimize the query
    const profiles = await AlumniProfile.find({})
      .select('fullName profilePictureUrl currentPosition currentCompany education user')
      .limit(4)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      profiles,
    });
  } catch (error) {
    console.error('Error fetching featured alumni:', error);
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

