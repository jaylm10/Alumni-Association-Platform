import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, Loader2 } from 'lucide-react';

import './Alumni.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Alumni = () => {
  const [allAlumni, setAllAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all alumni profiles when the component mounts
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Please log in to view alumni.");
          setIsLoading(false);
          return;
        }

        const { data } = await axios.get('http://localhost:3000/api/profile/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAllAlumni(data.profiles);
        setFilteredAlumni(data.profiles);
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
        toast.error("Could not load alumni data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Handle search filtering whenever the search query changes
  useEffect(() => {
    const results = allAlumni.filter(alumnus => {
      const query = searchQuery.toLowerCase();
      const nameMatch = alumnus.fullName?.toLowerCase().includes(query);
      const positionMatch = alumnus.currentPosition?.toLowerCase().includes(query);
      const companyMatch = alumnus.currentCompany?.toLowerCase().includes(query);
      // Optional: search in skills array
      const skillsMatch = alumnus.skills?.some(skill => skill.toLowerCase().includes(query));

      return nameMatch || positionMatch || companyMatch || skillsMatch;
    });
    setFilteredAlumni(results);
  }, [searchQuery, allAlumni]);

  return (
    <div className="alumni-page-container">
      <Header />
      <main className="alumni-main">
        <div className="alumni-header">
          <h1>Meet Our Alumni</h1>
          <p>Connect with a global network of professionals from our community.</p>
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by name, company, position, or skill..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <Loader2 className="animate-spin" size={48} />
            <p>Loading Alumni...</p>
          </div>
        ) : (
          <div className="alumni-grid">
            {filteredAlumni.length > 0 ? (
              filteredAlumni.map((alumnus) => (
                <div key={alumnus._id} className="alumni-card">
                  <div className="alumni-image-container">
                    <img src={alumnus.profilePictureUrl || 'https://via.placeholder.com/300'} alt={alumnus.fullName} />
                    <div className="overlay">
                      {/* In a real app, you'd use Link from react-router-dom */}
                      <a href={`/alumni/${alumnus._id}`} className="btn btn-view">
                        View Profile
                      </a>
                    </div>
                  </div>
                  <div className="alumni-info">
                    <h3>{alumnus.fullName}</h3>
                    {/* Display year from the first education entry as a proxy */}
                    {alumnus.education && alumnus.education.length > 0 && (
                      <p className="graduation-year">
                        Class of {alumnus.education[0].year}
                      </p>
                    )}
                    <p className="role">
                      {alumnus.currentPosition || 'Position not specified'} at {alumnus.currentCompany || 'Company not specified'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No alumni found matching your search.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Alumni;
