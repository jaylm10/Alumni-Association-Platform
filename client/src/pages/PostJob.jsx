import React, { useState } from 'react';
import { 
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  List,
  X,
  Upload,
  ChevronDown
} from 'lucide-react';
import './PostJob.css';
import Header from "../components/Header";
import Footer from '../components/Footer';
import axios from "axios";
import { toast } from "react-toastify"; // if you're using toast notifications

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    companyLink: '',
    logoUrl: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    responsibilities: [''],
    requirements: ['']
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addArrayField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.salary.trim()) newErrors.salary = 'Salary is required';
    
    // Validate responsibilities
    formData.responsibilities.forEach((item, index) => {
      if (!item.trim()) newErrors[`responsibility-${index}`] = 'Responsibility cannot be empty';
    });
    
    // Validate requirements
    formData.requirements.forEach((item, index) => {
      if (!item.trim()) newErrors[`requirement-${index}`] = 'Requirement cannot be empty';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (validate()) {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token"); 

      const { data } = await axios.post(
        "http://localhost:3000/api/jobs/post", 
        {
          ...formData,
          posted: new Date().toISOString(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      setSuccessMessage("Job posted successfully!");
      toast.success("Job posted successfully!");

      // reset form after success
      setFormData({
        title: "",
        company: "",
        companyLink: "",
        logoUrl: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: "",
        responsibilities: [""],
        requirements: [""],
      });
    } catch (error) {
      console.error("Error posting job:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  }
};

  return (
    <div className="post-job-container">
      <Header />
      
      
      <main className="post-job-main">
        <div className="post-job-form-container">
          <h1 className="post-job-title">
            <Briefcase size={24} />
            <span>Post a New Job</span>
          </h1>
          
          {successMessage && (
            <div className="post-job-success">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="post-job-form">
            {/* Basic Job Information */}
            <div className="form-section">
              <h2 className="section-title">Basic Information</h2>
              
              <div className="form-grid">
                <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
                  <label htmlFor="title">Job Title*</label>
                  <div className="input-with-icon">
                    <Briefcase size={18} />
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="e.g. Software Engineer"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.title && <span className="error-message">{errors.title}</span>}
                </div>
                
                <div className={`form-group ${errors.company ? 'has-error' : ''}`}>
                  <label htmlFor="company">Company Name*</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={handleChange}
                  />
                  {errors.company && <span className="error-message">{errors.company}</span>}
                </div>

                 <div className="form-group">
              <label htmlFor="companyLink">Company Website/Apply Link*</label>
              <div className="input-with-icon">
                {/* <LinkIcon size={18} /> */}
                <input
                  type="url"
                  id="companyLink"
                  name="companyLink"
                  placeholder="https://company.com/careers"
                  value={formData.companyLink}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.companyLink && <span className="error-message">{errors.companyLink}</span>}
            </div>
                
                <div className="form-group">
                  <label htmlFor="logoUrl">Company Logo URL</label>
                  <input
                    type="url"
                    id="logoUrl"
                    name="logoUrl"
                    placeholder="https://example.com/logo.png"
                    value={formData.logoUrl}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={`form-group ${errors.location ? 'has-error' : ''}`}>
                  <label htmlFor="location">Location*</label>
                  <div className="input-with-icon">
                    <MapPin size={18} />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      placeholder="e.g. San Francisco, CA"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="type">Job Type</label>
                  <div className="select-wrapper">
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="select-arrow" />
                  </div>
                </div>
                
                <div className={`form-group ${errors.salary ? 'has-error' : ''}`}>
                  <label htmlFor="salary">Salary*</label>
                  <div className="input-with-icon">
                    <DollarSign size={18} />
                    <input
                      type="text"
                      id="salary"
                      name="salary"
                      placeholder="e.g. $120,000 - $150,000"
                      value={formData.salary}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.salary && <span className="error-message">{errors.salary}</span>}
                </div>
              </div>
            </div>
            
            {/* Job Description */}
            <div className="form-section">
              <h2 className="section-title">Job Description</h2>
              <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the job position, team, and company culture..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>
            </div>
            
            {/* Responsibilities */}
            <div className="form-section">
              <h2 className="section-title">
                <List size={20} />
                <span>Responsibilities</span>
              </h2>
              
              {formData.responsibilities.map((responsibility, index) => (
                <div key={index} className={`form-group array-field ${errors[`responsibility-${index}`] ? 'has-error' : ''}`}>
                  <div className="array-input-container">
                    <input
                      type="text"
                      placeholder={`Responsibility #${index + 1}`}
                      value={responsibility}
                      onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                    />
                    {formData.responsibilities.length > 1 && (
                      <button
                        type="button"
                        className="remove-array-item"
                        onClick={() => removeArrayField('responsibilities', index)}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {errors[`responsibility-${index}`] && (
                    <span className="error-message">{errors[`responsibility-${index}`]}</span>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                className="add-array-item"
                onClick={() => addArrayField('responsibilities')}
              >
                + Add Responsibility
              </button>
            </div>
            
            {/* Requirements */}
            <div className="form-section">
              <h2 className="section-title">
                <FileText size={20} />
                <span>Requirements</span>
              </h2>
              
              {formData.requirements.map((requirement, index) => (
                <div key={index} className={`form-group array-field ${errors[`requirement-${index}`] ? 'has-error' : ''}`}>
                  <div className="array-input-container">
                    <input
                      type="text"
                      placeholder={`Requirement #${index + 1}`}
                      value={requirement}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        className="remove-array-item"
                        onClick={() => removeArrayField('requirements', index)}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {errors[`requirement-${index}`] && (
                    <span className="error-message">{errors[`requirement-${index}`]}</span>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                className="add-array-item"
                onClick={() => addArrayField('requirements')}
              >
                + Add Requirement
              </button>
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PostJob;