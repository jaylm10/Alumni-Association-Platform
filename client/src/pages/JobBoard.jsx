import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Filter, 
  X,
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import './JobBoard.css';
import Header from "../components/Header"
import Footer from '../components/Footer';
import {AuthContext} from '../contexts/AuthContextProvider';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from "axios";


const JobBoard = () => {

   const {role} = useContext(AuthContext);
   const navigate = useNavigate();

   const [jobs, setJobs] = useState([]);
   const [loading, setLoading] = useState(true);

     useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token"); // get token from login
        const { data } = await axios.get("http://localhost:3000/api/jobs/", {
          headers: {
            Authorization: `Bearer ${token}`, // send token if your route is protected
          },
        });
        setJobs(data.jobs || []); // assuming backend sends array of jobs
        console.log(data);
        
      } catch (error) {
        console.error("Error fetching jobs:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);







  // States for UI
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [datePostedFilter, setDatePostedFilter] = useState('');
  
  // Mock job data
  // const jobs = [
  //   {
  //     id: 1,
  //     title: "Software Engineer",
  //     company: "TechCorp",
  //     logoUrl: "https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0-852x852.jpg",
  //     location: "San Francisco, CA",
  //     type: "Full-time",
  //     salary: "$120,000 - $150,000",
  //     posted: "3 days ago",
  //     description: "TechCorp is seeking an experienced Software Engineer to join our innovative team. The ideal candidate will have expertise in web development, API design, and cloud-based solutions.",
  //     responsibilities: [
  //       "Design and develop high-quality software solutions",
  //       "Write clean, maintainable code and perform code reviews",
  //       "Troubleshoot, debug and upgrade existing systems",
  //       "Collaborate with cross-functional teams to define and implement new features",
  //       "Ensure software performance, quality, and responsiveness"
  //     ],
  //     requirements: [
  //       "Bachelor's degree in Computer Science or related field",
  //       "3+ years of experience in software development",
  //       "Proficiency in JavaScript, React, and Node.js",
  //       "Experience with database systems (SQL, NoSQL)",
  //       "Strong problem-solving abilities and attention to detail"
  //     ]
  //   },
   
  // ];
  
  // Filter jobs based on search query and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesLocation = locationFilter === '' || job.location.includes(locationFilter);
    const matchesJobType = jobTypeFilter === '' || job.type === jobTypeFilter;
    const matchesSalary = salaryFilter === '' || job.salary.includes(salaryFilter);
    const matchesCompany = companyFilter === '' || job.company === companyFilter;
    
    // Simple date posted filter (would be more sophisticated in real app)
    const matchesDatePosted = datePostedFilter === '' || 
      (datePostedFilter === 'Last 24 hours' && job.posted.includes('day')) ||
      (datePostedFilter === 'Last week' && !job.posted.includes('week')) ||
      (datePostedFilter === 'Last month' && true);
      
    return matchesSearch && matchesLocation && matchesJobType && 
           matchesSalary && matchesCompany && matchesDatePosted;
  });
  
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  const resetFilters = () => {
    setLocationFilter('');
    setJobTypeFilter('');
    setSalaryFilter('');
    setCompanyFilter('');
    setDatePostedFilter('');
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Unique values for filters
  const locations = [...new Set(jobs.map(job => job.location))];
  const jobTypes = [...new Set(jobs.map(job => job.type))];
  const companies = [...new Set(jobs.map(job => job.company))];

  return (
    <div className="job-board-container">
      {/* Header/Nav */}
       <Header/>

      {/* Hero Section */}
      <section className="jb-hero">
        <div className="jb-hero-content">
          <h1>Find Your Next Opportunity!</h1>
          <p>Discover exclusive job listings from our alumni network</p>
          
          <div className="jb-search-container">
            <div className="jb-search-box">
              <Search className="jb-search-icon" />
              <input 
                type="text" 
                placeholder="Search jobs, companies, or locations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="jb-btn jb-btn-primary jb-search-btn">Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="jb-main">
        <div className="jb-container">
          {/* Mobile Filter Toggle */}
          <div className="jb-mobile-filter-toggle">
            <button 
              className="jb-btn jb-btn-secondary jb-filter-toggle-btn"
              onClick={toggleFilters}
            >
              <Filter size={18} />
              <span>Filters</span>
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          <div className="jb-content">
            {/* Filter Sidebar */}
            <aside className={`jb-sidebar ${showFilters ? 'jb-sidebar-show' : ''}`}>
              <div className="jb-filter-header">
                <h3>Filters</h3>
                <button 
                  className="jb-btn jb-btn-text"
                  onClick={resetFilters}
                >
                  Reset All
                </button>
              </div>
              
              {/* Location Filter */}
              <div className="jb-filter-group">
                <h4>Location</h4>
                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="jb-select"
                >
                  <option value="">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              {/* Job Type Filter */}
              <div className="jb-filter-group">
                <h4>Job Type</h4>
                <div className="jb-radio-group">
                  <label className="jb-radio">
                    <input 
                      type="radio" 
                      name="jobType" 
                      value=""
                      checked={jobTypeFilter === ''}
                      onChange={() => setJobTypeFilter('')}
                    />
                    <span>All</span>
                  </label>
                  {jobTypes.map((type, index) => (
                    <label key={index} className="jb-radio">
                      <input 
                        type="radio" 
                        name="jobType" 
                        value={type}
                        checked={jobTypeFilter === type}
                        onChange={() => setJobTypeFilter(type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Salary Range Filter */}
              <div className="jb-filter-group">
                <h4>Salary Range</h4>
                <select 
                  value={salaryFilter}
                  onChange={(e) => setSalaryFilter(e.target.value)}
                  className="jb-select"
                >
                  <option value="">Any Salary</option>
                  <option value="$30">$30+ per hour</option>
                  <option value="$80,000">$80,000+</option>
                  <option value="$100,000">$100,000+</option>
                  <option value="$120,000">$120,000+</option>
                  <option value="$150,000">$150,000+</option>
                </select>
              </div>
              
              {/* Company Filter */}
              <div className="jb-filter-group">
                <h4>Company</h4>
                <select 
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="jb-select"
                >
                  <option value="">All Companies</option>
                  {companies.map((company, index) => (
                    <option key={index} value={company}>{company}</option>
                  ))}
                </select>
              </div>
              
              {/* Date Posted Filter */}
              <div className="jb-filter-group">
                <h4>Date Posted</h4>
                <div className="jb-radio-group">
                  <label className="jb-radio">
                    <input 
                      type="radio" 
                      name="datePosted" 
                      value=""
                      checked={datePostedFilter === ''}
                      onChange={() => setDatePostedFilter('')}
                    />
                    <span>Any time</span>
                  </label>
                  <label className="jb-radio">
                    <input 
                      type="radio" 
                      name="datePosted" 
                      value="Last 24 hours"
                      checked={datePostedFilter === 'Last 24 hours'}
                      onChange={() => setDatePostedFilter('Last 24 hours')}
                    />
                    <span>Last 24 hours</span>
                  </label>
                  <label className="jb-radio">
                    <input 
                      type="radio" 
                      name="datePosted" 
                      value="Last week"
                      checked={datePostedFilter === 'Last week'}
                      onChange={() => setDatePostedFilter('Last week')}
                    />
                    <span>Last week</span>
                  </label>
                  <label className="jb-radio">
                    <input 
                      type="radio" 
                      name="datePosted" 
                      value="Last month"
                      checked={datePostedFilter === 'Last month'}
                      onChange={() => setDatePostedFilter('Last month')}
                    />
                    <span>Last month</span>
                  </label>
                </div>
              </div>
            </aside>
            
            {/* Job Listings */}
            <div className="jb-job-list">
              <div className="jb-job-count">
                <h2>{filteredJobs.length} Jobs Found</h2>
              </div>
              
              {filteredJobs.length === 0 ? (
                <div className="jb-no-results">
                  <p>No jobs match your current filters. Try adjusting your search criteria.</p>
                  <button 
                    className="jb-btn jb-btn-secondary"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="jb-job-grid">
                  {filteredJobs.map(job => (
                    <div key={job.id} className="jb-job-card">
                      <div className="jb-job-header">
                        <div className="jb-company-logo">
                          <img src={job.logoUrl} alt={`${job.company} logo`} />
                        </div>
                        <div className="jb-job-title">
                          <h3>{job.title}</h3>
                          <p className="jb-company-name">{job.company}</p>
                        </div>
                      </div>
                      
                      <div className="jb-job-details">
                        <div className="jb-job-meta">
                          <div className="jb-meta-item">
                            <MapPin size={16} />
                            <span>{job.location}</span>
                          </div>
                          <div className="jb-meta-item">
                            <Briefcase size={16} />
                            <span>{job.type}</span>
                          </div>
                          <div className="jb-meta-item">
                            <DollarSign size={16} />
                            <span>{job.salary}</span>
                          </div>
                          <div className="jb-meta-item">
                            <Calendar size={16} />
                            <span>Posted {job.posted}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="jb-job-actions">
                        <button 
                          className="jb-btn jb-btn-primary"
                          onClick={() => handleViewDetails(job)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Post a Job Button */}
      {(role=='alumni') &&
      <button className='jb-post-job-btn' onClick={()=> navigate('/post-job')}>
        Post a Job
      </button>
      }

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="jb-modal">
          <div className="jb-modal-backdrop" onClick={closeModal}></div>
          <div className="jb-modal-content">
            <button className="jb-modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className="jb-modal-header">
              <div className="jb-modal-company-logo">
                <img src={selectedJob.logoUrl} alt={`${selectedJob.company} logo`} />
              </div>
              <div>
                <h2>{selectedJob.title}</h2>
                <p className="jb-modal-company">{selectedJob.company}</p>
                
                <div className="jb-modal-meta">
                  <div className="jb-meta-item">
                    <MapPin size={16} />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="jb-meta-item">
                    <Briefcase size={16} />
                    <span>{selectedJob.type}</span>
                  </div>
                  <div className="jb-meta-item">
                    <DollarSign size={16} />
                    <span>{selectedJob.salary}</span>
                  </div>
                  <div className="jb-meta-item">
                    <Calendar size={16} />
                    <span>Posted {selectedJob.posted}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="jb-modal-body">
              <section className="jb-job-section">
                <h3>Job Description</h3>
                <p>{selectedJob.description}</p>
              </section>
              
              <section className="jb-job-section">
                <h3>Responsibilities</h3>
                <ul className="jb-job-list-items">
                  {selectedJob.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
              
              <section className="jb-job-section">
                <h3>Requirements</h3>
                <ul className="jb-job-list-items">
                  {selectedJob.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
            
            <div className="jb-modal-footer">
              <button className="jb-btn jb-btn-primary jb-apply-btn">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default JobBoard;