exports.isAlumni = (req, res, next) => {
  if (req.user && req.user.role === 'alumni') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Alumni only.' });
  }
};
