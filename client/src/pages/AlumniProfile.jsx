import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Added for API calls
import { toast } from 'react-toastify'; // Added for notifications
import { 
  User, 
  Mail, 
  Linkedin, 
  Github, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Camera,
  Plus,
  X,
  Edit3,
  Save,
  Phone,
  Globe,
  Loader2 // Added for loading indicator
} from "lucide-react";
import './AlumniProfile.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

const AlumniProfile = () => {
  // State for editing mode
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for save button loading state
  const [hasProfile, setHasProfile] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    fullName: '',
    profilePicture: null,
    profilePictureUrl: '',
    bio: '',
    currentCompany: '',
    currentPosition: '',
    location: '',
    education: [
      {
        id: 1,
        degree: '',
        institution: '',
        year: '',
        field: ''
      }
    ],
    skills: [],
    contact: {
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      website: ''
    }
  });

  // Temporary state for new skill input
  const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:3000/api/profile/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // A profile was successfully found
        setProfileData({
          ...data.profile,
          contact: data.profile.contact || {},
          education: data.profile.education || [],
          skills: data.profile.skills || []
        });
        setHasProfile(true);

      } catch (error) {
        if (error.response && error.response.status === 404) {
          // This is the expected case for a new user.
          setHasProfile(false);
        } else {
          console.error('Failed to fetch profile:', error);
          toast.error('An error occurred while loading your profile.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle input changes
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle contact info changes
  const handleContactChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  // Handle education changes
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...profileData.education];
    updatedEducation[index][field] = value;
    setProfileData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };

  // Add new education entry
  const addEducation = () => {
    setProfileData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          degree: '',
          institution: '',
          year: '',
          field: ''
        }
      ]
    }));
  };

  // Remove education entry
  const removeEducation = (index) => {
    if (profileData.education.length > 1) {
      const updatedEducation = profileData.education.filter((_, i) => i !== index);
      setProfileData(prev => ({
        ...prev,
        education: updatedEducation
      }));
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: file,
          profilePictureUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add skill
  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Handle key press for skill input
  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // --- SAVE PROFILE FUNCTION ---
   const saveProfile = async () => {
    if (!profileData.fullName.trim()) {
      toast.error("Full Name is a required field.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      // --- CREATE FORMDATA ---
      // This is the standard way to send files and data together.
      const formData = new FormData();

      // Append all the text fields
      formData.append('fullName', profileData.fullName);
      formData.append('bio', profileData.bio);
      formData.append('currentCompany', profileData.currentCompany);
      formData.append('currentPosition', profileData.currentPosition);
      formData.append('location', profileData.location);
      
      // Stringify nested objects and arrays before appending
      formData.append('contact', JSON.stringify(profileData.contact));
      formData.append('education', JSON.stringify(profileData.education.map(({ id, ...rest }) => rest)));
      formData.append('skills', JSON.stringify(profileData.skills));
      
      // Append the actual file object if it exists
      if (profileData.profilePicture) {
        formData.append('profilePicture', profileData.profilePicture);
      } else {
        // If no new picture, send the existing URL
        formData.append('profilePictureUrl', profileData.profilePictureUrl);
      }

      // --- MAKE THE API CALL ---
      // Axios will automatically set the correct 'Content-Type: multipart/form-data' header
      const { data } = await axios.post('http://localhost:3000/api/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Profile saved successfully!');
      setIsEditing(false);
      setProfileData(data.profile);

    } catch (error) {
      console.error('Error saving profile:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Failed to save profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if profile has data
  const hasProfileData = profileData.fullName || profileData.bio || profileData.currentCompany;

  return (
    <div className="profile-container">
      <Header />
      
      <main className="profile-main">
        <div className="profile-content">
          <div className="profile-header">
            <h1>Alumni Profile</h1>
            <p>Create and manage your professional profile</p>
          </div>

          <div className="profile-card">
            {!hasProfileData && !isEditing ? (
              // Empty state
              <div className="profile-empty-state">
                <div className="empty-state-icon">
                  <User size={64} />
                </div>
                <h2>Create Your Alumni Profile</h2>
                <p>Share your professional journey with fellow alumni and students. Your profile helps build connections and opportunities within our community.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Create Profile
                </button>
              </div>
            ) : (
              <>
                {/* Profile Display/Edit Mode */}
                <div className="profile-content-wrapper">
                  {/* Profile Header Section */}
                  <div className="profile-section profile-header-section">
                    <div className="profile-hero">
                      <div className="profile-picture-container">
                        {isEditing ? (
                          <label className="profile-picture-upload">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePictureChange}
                              hidden
                            />
                            <div className="profile-picture-preview">
                              {profileData.profilePictureUrl ? (
                                <img src={profileData.profilePictureUrl} alt="Profile" />
                              ) : (
                                <User size={60} />
                              )}
                              <div className="picture-upload-overlay">
                                <Camera size={24} />
                              </div>
                            </div>
                          </label>
                        ) : (
                          <div className="profile-picture">
                            {profileData.profilePictureUrl ? (
                              <img src={profileData.profilePictureUrl} alt="Profile" />
                            ) : (
                              <User size={60} />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="profile-info">
                        {isEditing ? (
                          <div className="profile-edit-form">
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={profileData.fullName}
                              onChange={(e) => handleInputChange('fullName', e.target.value)}
                              className="profile-input profile-name-input"
                            />
                            <div className="profile-position-inputs">
                              <input
                                type="text"
                                placeholder="Current Position"
                                value={profileData.currentPosition}
                                onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                                className="profile-input"
                              />
                              <input
                                type="text"
                                placeholder="Company"
                                value={profileData.currentCompany}
                                onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                                className="profile-input"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Location"
                              value={profileData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              className="profile-input profile-location-input"
                            />
                          </div>
                        ) : (
                          <div className="profile-display-info">
                            <h1 className="profile-name">{profileData.fullName || 'Your Name'}</h1>
                            <div className="profile-position">
                              {profileData.currentPosition && (
                                <span className="position-title">{profileData.currentPosition}</span>
                              )}
                              {profileData.currentCompany && (
                                <span className="position-company"> at {profileData.currentCompany}</span>
                              )}
                            </div>
                            {profileData.location && (
                              <div className="profile-location">
                                <MapPin size={16} />
                                <span>{profileData.location}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {!isEditing && (
                      <div className="profile-actions">
                        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                          <Edit3 size={16} />
                          Edit Profile
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bio Section */}
                  <div className="profile-section">
                    <h3 className="section-title">About</h3>
                    {isEditing ? (
                      <textarea
                        placeholder="Tell us about yourself, your career journey, interests, and what you're passionate about..."
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="profile-textarea"
                        rows={4}
                      />
                    ) : (
                      <p className="profile-bio">
                        {profileData.bio || 'Share your story, career journey, and what drives you professionally.'}
                      </p>
                    )}
                  </div>

                  {/* Education Section */}
                  <div className="profile-section">
                    <div className="section-header">
                      <h3 className="section-title">
                        <GraduationCap size={20} />
                        Education
                      </h3>
                      {isEditing && (
                        <button className="btn btn-ghost btn-sm" onClick={addEducation}>
                          <Plus size={16} />
                          Add Education
                        </button>
                      )}
                    </div>

                    <div className="education-list">
                      {profileData.education.map((edu, index) => (
                        <div key={edu.id} className="education-item">
                          {isEditing ? (
                            <div className="education-form">
                              <div className="form-row">
                                <input
                                  type="text"
                                  placeholder="Degree (e.g., Bachelor of Science)"
                                  value={edu.degree}
                                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                  className="profile-input"
                                />
                                <input
                                  type="text"
                                  placeholder="Field of Study"
                                  value={edu.field}
                                  onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                                  className="profile-input"
                                />
                              </div>
                              <div className="form-row">
                                <input
                                  type="text"
                                  placeholder="Institution"
                                  value={edu.institution}
                                  onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                  className="profile-input"
                                />
                                <input
                                  type="text"
                                  placeholder="Year (e.g., 2018-2022)"
                                  value={edu.year}
                                  onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                  className="profile-input"
                                />
                              </div>
                              {profileData.education.length > 1 && (
                                <button 
                                  className="btn btn-ghost btn-sm remove-btn"
                                  onClick={() => removeEducation(index)}
                                >
                                  <X size={16} />
                                  Remove
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="education-display">
                              <div className="education-details">
                                <h4 className="education-degree">
                                  {edu.degree || 'Your Degree'} 
                                  {edu.field && <span className="education-field">in {edu.field}</span>}
                                </h4>
                                <p className="education-institution">{edu.institution || 'University Name'}</p>
                                {edu.year && <p className="education-year">{edu.year}</p>}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="profile-section">
                    <h3 className="section-title">Skills & Expertise</h3>
                    
                    {isEditing && (
                      <div className="skill-input-container">
                        <input
                          type="text"
                          placeholder="Add a skill (press Enter)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={handleSkillKeyPress}
                          className="profile-input skill-input"
                        />
                        <button className="btn btn-ghost btn-sm" onClick={addSkill}>
                          <Plus size={16} />
                          Add
                        </button>
                      </div>
                    )}

                    <div className="skills-container">
                      {profileData.skills.length > 0 ? (
                        profileData.skills.map((skill, index) => (
                          <div key={index} className="skill-tag">
                            <span>{skill}</span>
                            {isEditing && (
                              <button 
                                className="skill-remove"
                                onClick={() => removeSkill(skill)}
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="empty-skills">
                          {isEditing ? 'Add your skills above' : 'No skills added yet'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="profile-section">
                    <h3 className="section-title">Contact Information</h3>
                    
                    <div className="contact-info">
                      {isEditing ? (
                        <div className="contact-form">
                          <div className="form-group">
                            <div className="input-with-icon">
                              <Mail size={16} />
                              <input
                                type="email"
                                placeholder="Email address"
                                value={profileData.contact.email}
                                onChange={(e) => handleContactChange('email', e.target.value)}
                                className="profile-input"
                              />
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <div className="input-with-icon">
                              <Phone size={16} />
                              <input
                                type="tel"
                                placeholder="Phone number"
                                value={profileData.contact.phone}
                                onChange={(e) => handleContactChange('phone', e.target.value)}
                                className="profile-input"
                              />
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <div className="input-with-icon">
                              <Linkedin size={16} />
                              <input
                                type="url"
                                placeholder="LinkedIn profile URL"
                                value={profileData.contact.linkedin}
                                onChange={(e) => handleContactChange('linkedin', e.target.value)}
                                className="profile-input"
                              />
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <div className="input-with-icon">
                              <Github size={16} />
                              <input
                                type="url"
                                placeholder="GitHub profile URL"
                                value={profileData.contact.github}
                                onChange={(e) => handleContactChange('github', e.target.value)}
                                className="profile-input"
                              />
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <div className="input-with-icon">
                              <Globe size={16} />
                              <input
                                type="url"
                                placeholder="Personal website"
                                value={profileData.contact.website}
                                onChange={(e) => handleContactChange('website', e.target.value)}
                                className="profile-input"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="contact-display">
                          {profileData.contact.email && (
                            <div className="contact-item">
                              <Mail size={16} />
                              <a href={`mailto:${profileData.contact.email}`}>
                                {profileData.contact.email}
                              </a>
                            </div>
                          )}
                          
                          {profileData.contact.phone && (
                            <div className="contact-item">
                              <Phone size={16} />
                              <a href={`tel:${profileData.contact.phone}`}>
                                {profileData.contact.phone}
                              </a>
                            </div>
                          )}
                          
                          {profileData.contact.linkedin && (
                            <div className="contact-item">
                              <Linkedin size={16} />
                              <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer">
                                LinkedIn Profile
                              </a>
                            </div>
                          )}
                          
                          {profileData.contact.github && (
                            <div className="contact-item">
                              <Github size={16} />
                              <a href={profileData.contact.github} target="_blank" rel="noopener noreferrer">
                                GitHub Profile
                              </a>
                            </div>
                          )}
                          
                          {profileData.contact.website && (
                            <div className="contact-item">
                              <Globe size={16} />
                              <a href={profileData.contact.website} target="_blank" rel="noopener noreferrer">
                                Personal Website
                              </a>
                            </div>
                          )}
                          
                          {!Object.values(profileData.contact).some(value => value) && (
                            <p className="empty-contact">No contact information added yet</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Profile Button - Only show when editing */}
                  {isEditing && (
                    <div className="profile-save-section">
                      <button 
                        className="btn btn-primary btn-save" 
                        onClick={saveProfile}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {isSubmitting ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AlumniProfile;
