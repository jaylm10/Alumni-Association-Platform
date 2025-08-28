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
  // Destructure all expected fields from the request body
  const {
    fullName,
    profilePictureUrl,
    bio,
    currentCompany,
    currentPosition,
    location,
  } = req.body;

    // Parse stringified fields
  const contact = JSON.parse(req.body.contact || '{}');
  const education = JSON.parse(req.body.education || '[]');
  const skills = JSON.parse(req.body.skills || '[]');

  // --- Build the profile object with the data from the frontend ---
  const profileFields = {};
  profileFields.user = req.user.id; // Link the profile to the logged-in user

  if (req.file) {
    // Construct the URL path to the image
    // Example path: 'uploads/profile-pictures/profilePicture-163338888.png'
    profileFields.profilePictureUrl = req.file.path.replace(/\\/g, "/").substring("public/".length);
  } else if (req.body.profilePictureUrl) {
    // If no new file is uploaded, keep the existing URL from the form
    profileFields.profilePictureUrl = req.body.profilePictureUrl;
  }

  // Add fields to the object only if they exist in the request body
  if (fullName) profileFields.fullName = fullName;
  if (profilePictureUrl) profileFields.profilePictureUrl = profilePictureUrl;
  if (bio) profileFields.bio = bio;
  if (currentCompany) profileFields.currentCompany = currentCompany;
  if (currentPosition) profileFields.currentPosition = currentPosition;
  if (location) profileFields.location = location;

  // For arrays and objects, check if they are provided
  if (skills) {
    // If skills are sent as a comma-separated string, convert to an array
    profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
  }
  if (education) profileFields.education = education;
  if (contact) profileFields.contact = contact;

  try {
    // Using findOneAndUpdate with 'upsert' is the standard for create/update logic.
    // - It tries to find a document matching { user: req.user.id }.
    // - If it finds one, it updates it with profileFields.
    // - If it doesn't find one, `upsert: true` creates a new document.
    // - `new: true` ensures the updated (or new) document is returned.
    const profile = await AlumniProfile.findOneAndUpdate(
      { user: req.user.id }, // Find a profile with this user ID
      { $set: profileFields }, // The data to update or insert
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Send the newly created or updated profile back
    res.status(200).json({
      success: true,
      message: 'Profile saved successfully.',
      profile,
    });

  } catch (error) {
    console.error('Error saving alumni profile:', error);
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error: Could not save profile.',
      error: error.message,
    });
  }
};