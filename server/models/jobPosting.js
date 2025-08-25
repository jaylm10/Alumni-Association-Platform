const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [50, 'Company name cannot exceed 50 characters']
  },
  companyLink: {
    type: String,
    required: [true, 'Company website/apply link is required'],
    trim: true,
    validate: {
  validator: function(v) {
    // This regex is more robust and allows for query parameters
    return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v);
  },
  message: props => `${props.value} is not a valid URL!`
}
  },
  logoUrl: {
    type: String,
    trim: true,
    default: 'https://via.placeholder.com/150?text=Company+Logo',
    validate: {
  validator: function(v) {
    // This regex is more robust and allows for query parameters
    return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v);
  },
  message: props => `${props.value} is not a valid URL!`
}
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: {
      values: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
      message: '{VALUE} is not a valid job type'
    },
    default: 'Full-time'
  },
  salary: {
    type: String,
    required: [true, 'Salary information is required'],
    trim: true,
    maxlength: [50, 'Salary information cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  responsibilities: {
    type: [String],
    required: [true, 'At least one responsibility is required'],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.every(item => item.trim().length > 0);
      },
      message: 'Responsibilities cannot be empty'
    }
  },
  requirements: {
    type: [String],
    required: [true, 'At least one requirement is required'],
    validate: {
      validator: function(v) {
        return v.length > 0 && v.every(item => item.trim().length > 0);
      },
      message: 'Requirements cannot be empty'
    }
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'register',
    required: [true, 'Poster user ID is required']
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
jobPostingSchema.index({ title: 'text', company: 'text', description: 'text' });
jobPostingSchema.index({ location: 1 });
jobPostingSchema.index({ type: 1 });
jobPostingSchema.index({ postedBy: 1 });
jobPostingSchema.index({ isActive: 1 });

// Middleware to update lastUpdated field
jobPostingSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Virtual for "posted X days ago"
jobPostingSchema.virtual('posted').get(function() {
  const days = Math.floor((Date.now() - this.postedAt) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
});

module.exports = mongoose.model('JobPosting', jobPostingSchema);