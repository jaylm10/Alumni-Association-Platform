const Job = require('../models/jobPosting');

// Create a new Job Posting
exports.jobPosting = async (req, res) => {
  try {
    // If you're using authentication, you should already have req.user set by middleware
    const userId = req.user?.id; 
    // console.log(userId);
    

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User ID is required.' });
    }

    const {
      title,
      company,
      companyLink,
      logoUrl,
      location,
      type,
      salary,
      description,
      responsibilities,
      requirements
    } = req.body;

    // Create new job posting
    const newJob = new Job({
      title,
      company,
      companyLink,
      logoUrl,
      location,
      type,
      salary,
      description,
      responsibilities,
      requirements,
      postedBy: userId
    });

    // Save job to DB
    await newJob.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job: newJob
    });

  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to post job',
      error: error.message
    });
  }
};

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate('postedBy', 'name email role') // populate alumni info
      .sort({ postedAt: -1 });

    res.status(200).json({
      jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email role');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};
