import React, { useState, useEffect } from 'react';
// Import useNavigate to redirect the user after creating a conversation
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Linkedin, Github, MapPin, Briefcase, GraduationCap, Globe, Loader2, MessageSquare, Calendar } from "lucide-react";

import './AlumniPublicProfile.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AlumniPublicProfile = () => {
  const { alumniId } = useParams();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false); // State for the button's loading indicator

  useEffect(() => {
    const fetchAlumnusProfile = async () => {
      if (!alumniId) return;

      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:3000/api/profile/${alumniId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data.profile);
      } catch (error) {
        console.error("Failed to fetch alumni profile:", error);
        toast.error("Could not load the alumni profile. It may not exist.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlumnusProfile();
  }, [alumniId]);
  
  // --- NEW: FUNCTION TO HANDLE SEND MESSAGE CLICK ---
  const handleSendMessage = async () => {
    if (!profile || !profile.user) {
        toast.error("Cannot initiate chat, user data is missing.");
        return;
    }

    setIsConnecting(true);
    try {
        const token = localStorage.getItem('token');
        
        // Call the endpoint to find or create a conversation
        const { data } = await axios.post('http://localhost:3000/api/conversations/start', 
            { recipientId: profile.user }, // The alumnus's user ID is in the `user` field of their profile
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success && data.conversation?._id) {
            // On success, navigate to the messages page with the specific conversation ID
            navigate(`/messages/${data.conversation._id}`);
        } else {
            toast.error("Could not start a conversation.");
        }

    } catch (error) {
        console.error("Error starting conversation:", error);
        toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
        setIsConnecting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="profile-container loading-state">
        <Loader2 className="animate-spin" size={48} />
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
        <div className="profile-container">
            <Header />
            <main className="profile-main">
                <div className="profile-content">
                    <p className="not-found">Alumni profile not found.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="profile-container">
      <Header />
      <main className="profile-main">
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-content-wrapper">
              
              {/* Profile Header */}
              <div className="profile-section profile-header-section">
                <div className="profile-hero">
                  <div className="profile-picture-container">
                    <div className="profile-picture">
                      <img src={profile.profilePictureUrl} alt={profile.fullName} />
                    </div>
                  </div>
                  <div className="profile-info">
                    <div className="profile-display-info">
                      <h1 className="profile-name">{profile.fullName}</h1>
                      <div className="profile-position">
                        <span className="position-title">{profile.currentPosition}</span>
                        <span className="position-company"> at {profile.currentCompany}</span>
                      </div>
                      <div className="profile-location">
                        <MapPin size={16} />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- UPDATED CONNECT ACTIONS SECTION --- */}
              <div className="profile-section connect-actions">
                {profile.connectionSettings?.isAcceptingMessages && (
                  <button className="btn btn-primary" onClick={handleSendMessage} disabled={isConnecting}>
                    {isConnecting ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        <MessageSquare size={16}/>
                    )}
                    {isConnecting ? 'Starting Chat...' : 'Send Message'}
                  </button>
                )}
                {profile.connectionSettings?.isAcceptingMeetings && (
                  <button className="btn btn-secondary">
                    <Calendar size={16}/> Request a Meeting
                  </button>
                )}
                {!profile.connectionSettings?.isAcceptingMessages && !profile.connectionSettings?.isAcceptingMeetings && (
                  <p className="connections-closed">This alumnus is not currently accepting new connections.</p>
                )}
              </div>

              {/* ... The rest of your Bio, Education, Skills, and Contact sections remain the same ... */}
              <div className="profile-section">
                <h3 className="section-title">About</h3>
                <p className="profile-bio">{profile.bio || "No bio provided."}</p>
              </div>

              <div className="profile-section">
                <h3 className="section-title"><GraduationCap size={20}/> Education</h3>
                <div className="education-list">
                  {profile.education?.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="education-display">
                        <div className="education-details">
                          <h4 className="education-degree">{edu.degree} <span className="education-field">in {edu.field}</span></h4>
                          <p className="education-institution">{edu.institution}</p>
                          <p className="education-year">{edu.year}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-section">
                <h3 className="section-title">Skills & Expertise</h3>
                <div className="skills-container">
                  {profile.skills?.length > 0 ? profile.skills.map((skill, index) => (
                    <div key={index} className="skill-tag"><span>{skill}</span></div>
                  )) : <p>No skills listed.</p>}
                </div>
              </div>

              <div className="profile-section">
                <h3 className="section-title">Contact & Links</h3>
                <div className="contact-display">
                    {profile.contact?.linkedin && <a href={profile.contact.linkedin} className="contact-item" target="_blank" rel="noopener noreferrer"><Linkedin size={16}/> LinkedIn Profile</a>}
                    {profile.contact?.github && <a href={profile.contact.github} className="contact-item" target="_blank" rel="noopener noreferrer"><Github size={16}/> GitHub Profile</a>}
                    {profile.contact?.website && <a href={profile.contact.website} className="contact-item" target="_blank" rel="noopener noreferrer"><Globe size={16}/> Personal Website</a>}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AlumniPublicProfile;

