const Job = require("../models/jobPosting");
const mongoose = require('mongoose');

// Create a new Job Posting
exports.jobPosting = async (req, res) => {
  
  try {
    const userId = req.user?.id;
    if (!userId) {
      console.log('No user ID found in token');
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID is required." });
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
      requirements,
    } = req.body;

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID format:', userId);
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    
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
      postedBy: userId,
    });
    
    try {
      // Add timeout to the save operation
      const savePromise = newJob.save();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database save operation timed out after 10 seconds')), 10000);
      });
      
      const savedJob = await Promise.race([savePromise, timeoutPromise]);
      console.log('Job saved successfully:', savedJob._id);
      console.log('Saved job data:', {
        title: savedJob.title,
        company: savedJob.company,
        postedBy: savedJob.postedBy
      });
    } catch (saveError) {
      console.error('Database save error:', saveError);
      console.error('Error details:', {
        name: saveError.name,
        message: saveError.message,
        stack: saveError.stack
      });
      throw saveError; // Re-throw to be caught by outer catch
    }

    return res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Error posting job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to post job",
      error: error.message,
    });
  }
};

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate("postedBy", "name email role") // populate alumni info
      .sort({ postedAt: -1 });

    res.status(200).json({
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email role"
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};
