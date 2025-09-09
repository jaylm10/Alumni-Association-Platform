import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, Loader2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import './Students.css'; // Using a new, dedicated CSS file
import Header from '../components/Header';
import Footer from '../components/Footer';

const Students = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [connectingTo, setConnectingTo] = useState(null); // Tracks which student is being connected to
  const navigate = useNavigate();

  // Fetch all students when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Please log in to view students.");
          setIsLoading(false);
          return;
        }

        const { data } = await axios.get('http://localhost:3000/api/student-profile/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAllStudents(data.profiles);
        setFilteredStudents(data.profiles);
      } catch (error) {
        console.error("Failed to fetch students:", error);
        toast.error("Could not load student data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students based on search query changes
  useEffect(() => {
    const results = allStudents.filter(student => {
      const query = searchQuery.toLowerCase();
      const nameMatch = student.fullName?.toLowerCase().includes(query);
      const majorMatch = student.major?.toLowerCase().includes(query);
      const skillsMatch = student.skills?.some(skill => skill.toLowerCase().includes(query));
      const interestsMatch = student.careerInterests?.some(interest => interest.toLowerCase().includes(query));

      return nameMatch || majorMatch || skillsMatch || interestsMatch;
    });
    setFilteredStudents(results);
  }, [searchQuery, allStudents]);

  // Function to start a chat with a student
  const handleStartChat = async (student) => {
    if (!student?.user) return; // Safety check
    setConnectingTo(student._id); // Show loading indicator on this specific card

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:3000/api/conversations/start', 
        { recipientId: student.user }, // student.user is the recipient's user ID
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success && data.conversation?._id) {
        navigate(`/messages/${data.conversation._id}`);
      }
    } catch (error) {
      toast.error("Could not start conversation.");
    } finally {
      setConnectingTo(null); // Hide loading indicator
    }
  };

  return (
    <div className="alumni-page-container">
      <Header />
      <main className="alumni-main">
        <div className="alumni-header">
          <h1>Find Talent</h1>
          <p>Discover and connect with the next generation of professionals.</p>
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by name, major, skills, or interests..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <Loader2 className="animate-spin" size={48} />
            <p>Loading Students...</p>
          </div>
        ) : (
          <div className="alumni-grid">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student._id} className="alumni-card">
                  <div className="alumni-image-container">
                    <img src={student.profilePictureUrl || 'https://via.placeholder.com/300'} alt={student.fullName} />
                    <div className="overlay">
                      <button 
                        onClick={() => handleStartChat(student)} 
                        className="btn btn-view"
                        disabled={connectingTo === student._id}
                      >
                        {connectingTo === student._id ? (
                          <Loader2 size={16} className="animate-spin"/>
                        ) : (
                          <MessageSquare size={16}/>
                        )}
                        {connectingTo === student._id ? 'Connecting...' : 'Message'}
                      </button>
                    </div>
                  </div>
                  <div className="alumni-info">
                    <h3>{student.fullName}</h3>
                    <p className="graduation-year">
                      Class of {student.expectedGraduationYear}
                    </p>
                    <p className="role">
                      {student.major}
                    </p>
                  </div>
                </div>
              ))
            ) : (
                <p className="no-results">No students found matching your search.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Students;

