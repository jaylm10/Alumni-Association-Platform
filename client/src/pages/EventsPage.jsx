import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  User,
  Filter, 
  X,
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Users,
  Globe,
  Star,
  MessageCircle,
  Plus
} from "lucide-react";
import './EventsPage.css';

const EventsPage = () => {
  // States for UI
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [comment, setComment] = useState('');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('upcoming');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  
  // Mock event data
  const events = [
    {
      id: 1,
      name: "Tech Industry Networking Night",
      date: "2023-06-15",
      timeStart: "18:00",
      timeEnd: "21:00",
      location: "University Conference Center",
      locationType: "in-person",
      type: "Networking",
      description: "Join us for an evening of networking with tech industry professionals. This is your chance to connect with alumni working at top tech companies and explore potential career opportunities.",
      shortDescription: "Connect with alumni from leading tech companies and explore career opportunities in a relaxed setting.",
      organizer: "Alumni Association Tech Chapter",
      organizerImage: "https://via.placeholder.com/50?text=TC",
      isFeatured: true,
      imageUrl: "https://via.placeholder.com/600x300?text=Tech+Networking+Event",
      attendees: 78,
      capacity: 100,
      speakers: [
        {
          name: "Sarah Johnson",
          title: "Senior Software Engineer at Google",
          image: "https://via.placeholder.com/100?text=SJ",
          bio: "Sarah is a senior software engineer at Google with 8 years of experience in cloud technologies. She graduated from our university in 2015 with a degree in Computer Science."
        },
        {
          name: "Michael Chen",
          title: "Product Manager at Microsoft",
          image: "https://via.placeholder.com/100?text=MC",
          bio: "Michael has been leading product teams at Microsoft for 5 years. He holds an MBA from our university and a bachelor's degree in Computer Engineering."
        }
      ],
      agenda: [
        {
          time: "18:00 - 18:30",
          activity: "Registration and Welcome Drinks"
        },
        {
          time: "18:30 - 19:15",
          activity: "Panel Discussion: Trends in Tech Industry"
        },
        {
          time: "19:15 - 20:30",
          activity: "Networking Session"
        },
        {
          time: "20:30 - 21:00",
          activity: "Closing Remarks and Final Networking"
        }
      ],
      comments: [
        {
          user: "Alex P.",
          text: "Looking forward to this event! Will there be representatives from startups as well?",
          timestamp: "2 days ago"
        },
        {
          user: "Jamie L.",
          text: "Last year's event was fantastic, definitely not missing this one.",
          timestamp: "1 week ago"
        }
      ]
    },
    {
      id: 2,
      name: "Annual Alumni Reunion",
      date: "2023-07-22",
      timeStart: "12:00",
      timeEnd: "22:00",
      location: "University Main Campus",
      locationType: "in-person",
      type: "Reunion",
      description: "Join fellow alumni for our biggest event of the year! The Annual Alumni Reunion brings together graduates from all years for a day of celebration, reminiscing, and reconnecting. The event includes campus tours, class-specific gatherings, dinner, and evening entertainment.",
      shortDescription: "The biggest alumni event of the year with activities, dinner, and entertainment for graduates from all class years.",
      organizer: "University Alumni Association",
      organizerImage: "https://via.placeholder.com/50?text=AA",
      isFeatured: true,
      imageUrl: "https://via.placeholder.com/600x300?text=Alumni+Reunion",
      attendees: 245,
      capacity: 500,
      speakers: [
        {
          name: "Dr. Robert Wilson",
          title: "University President",
          image: "https://via.placeholder.com/100?text=RW",
          bio: "Dr. Wilson has been the university president since 2018. He is committed to strengthening the connection between the university and its alumni community."
        }
      ],
      agenda: [
        {
          time: "12:00 - 14:00",
          activity: "Registration and Welcome Lunch"
        },
        {
          time: "14:00 - 16:00",
          activity: "Campus Tours and Class Gatherings"
        },
        {
          time: "16:00 - 18:00",
          activity: "Alumni Achievement Awards"
        },
        {
          time: "18:00 - 20:00",
          activity: "Dinner and Keynote Speech"
        },
        {
          time: "20:00 - 22:00",
          activity: "Evening Entertainment and Socializing"
        }
      ],
      comments: [
        {
          user: "Taylor M.",
          text: "Will there be special activities for the class of 2013? It's our 10-year reunion!",
          timestamp: "3 days ago"
        },
        {
          user: "Jordan K.",
          text: "Can't wait to see everyone again! Flying in from Seattle for this.",
          timestamp: "1 week ago"
        }
      ]
    },
    {
      id: 3,
      name: "Careers in Finance Webinar",
      date: "2023-06-05",
      timeStart: "17:30",
      timeEnd: "19:30",
      location: "Online (Zoom)",
      locationType: "online",
      type: "Webinar",
      description: "This webinar will feature alumni working in various sectors of finance who will share insights about their career paths, current industry trends, and advice for those looking to enter the field. Panelists include professionals from investment banking, financial analysis, fintech, and wealth management.",
      shortDescription: "Learn about different career paths in finance from alumni professionals in investment banking, financial analysis, fintech, and wealth management.",
      organizer: "Business School Alumni Network",
      organizerImage: "https://via.placeholder.com/50?text=BS",
      isFeatured: false,
      imageUrl: "https://via.placeholder.com/600x300?text=Finance+Webinar",
      attendees: 112,
      capacity: 300,
      speakers: [
        {
          name: "Emily Rodriguez",
          title: "Investment Banker at Goldman Sachs",
          image: "https://via.placeholder.com/100?text=ER",
          bio: "Emily has been working in investment banking for 7 years after graduating with an MBA. She specializes in mergers and acquisitions."
        },
        {
          name: "David Park",
          title: "Financial Analyst at JP Morgan",
          image: "https://via.placeholder.com/100?text=DP",
          bio: "David is a financial analyst with experience in risk assessment and portfolio management. He graduated with a degree in Finance in 2018."
        },
        {
          name: "Linda Chen",
          title: "Co-founder of FinTech startup PayQuick",
          image: "https://via.placeholder.com/100?text=LC",
          bio: "Linda launched her fintech startup three years after graduating. Her company has recently secured Series B funding."
        }
      ],
      agenda: [
        {
          time: "17:30 - 17:40",
          activity: "Introduction and Welcome"
        },
        {
          time: "17:40 - 18:30",
          activity: "Panel Discussion with Q&A"
        },
        {
          time: "18:30 - 19:00",
          activity: "Breakout Rooms by Finance Sector"
        },
        {
          time: "19:00 - 19:30",
          activity: "Networking and Closing Remarks"
        }
      ],
      comments: [
        {
          user: "Sam T.",
          text: "Will this be recorded for those who can't attend live?",
          timestamp: "5 days ago"
        },
        {
          user: "Morgan L.",
          text: "I'm interested in fintech specifically. Will there be time to ask specific questions about this area?",
          timestamp: "1 week ago"
        }
      ]
    },
    {
      id: 4,
      name: "Resume Workshop",
      date: "2023-05-20",
      timeStart: "14:00",
      timeEnd: "16:00",
      location: "Virtual Event (Zoom)",
      locationType: "online",
      type: "Workshop",
      description: "Get your resume ready for the job market with help from our alumni career advisors. This interactive workshop will cover resume best practices, common mistakes to avoid, and how to tailor your resume for specific industries. Participants will have the opportunity to receive personalized feedback on their resumes.",
      shortDescription: "Interactive workshop with alumni career advisors offering personalized feedback to optimize your resume for job applications.",
      organizer: "Career Development Center",
      organizerImage: "https://via.placeholder.com/50?text=CD",
      isFeatured: false,
      imageUrl: "https://via.placeholder.com/600x300?text=Resume+Workshop",
      attendees: 45,
      capacity: 50,
      speakers: [
        {
          name: "James Wilson",
          title: "Career Advisor and Former HR Director",
          image: "https://via.placeholder.com/100?text=JW",
          bio: "James worked as an HR Director for 15 years before joining the university's career development center. He has reviewed thousands of resumes throughout his career."
        }
      ],
      agenda: [
        {
          time: "14:00 - 14:30",
          activity: "Resume Basics and Current Trends"
        },
        {
          time: "14:30 - 15:00",
          activity: "Industry-Specific Resume Tailoring"
        },
        {
          time: "15:00 - 16:00",
          activity: "Resume Review in Small Groups"
        }
      ],
      comments: [
        {
          user: "Casey R.",
          text: "Should we submit our resumes in advance or bring them to the workshop?",
          timestamp: "2 days ago"
        }
      ]
    },
    {
      id: 5,
      name: "Healthcare Innovation Symposium",
      date: "2023-08-12",
      timeStart: "09:00",
      timeEnd: "17:00",
      location: "Medical School Auditorium",
      locationType: "in-person",
      type: "Conference",
      description: "This day-long symposium brings together alumni working in healthcare innovation to discuss the latest advancements, challenges, and opportunities in the field. Topics include digital health technologies, advances in medical devices, healthcare AI applications, and improving patient care through innovation.",
      shortDescription: "A comprehensive symposium on healthcare innovation featuring discussions on digital health, medical devices, AI, and patient care improvements.",
      organizer: "Medical Alumni Association",
      organizerImage: "https://via.placeholder.com/50?text=MA",
      isFeatured: true,
      imageUrl: "https://via.placeholder.com/600x300?text=Healthcare+Symposium",
      attendees: 132,
      capacity: 200,
      speakers: [
        {
          name: "Dr. Sarah Patel",
          title: "Chief Innovation Officer at Memorial Hospital",
          image: "https://via.placeholder.com/100?text=SP",
          bio: "Dr. Patel leads innovation initiatives at one of the nation's top hospitals. She holds multiple patents for medical devices and is passionate about improving patient outcomes through technology."
        },
        {
          name: "Dr. Thomas Lee",
          title: "Founder of MedTech Innovations",
          image: "https://via.placeholder.com/100?text=TL",
          bio: "Dr. Lee's company has developed breakthrough technologies for minimally invasive surgery. He graduated from our medical school in 2008."
        },
        {
          name: "Dr. Jessica Martinez",
          title: "Healthcare AI Researcher",
          image: "https://via.placeholder.com/100?text=JM",
          bio: "Dr. Martinez's research focuses on applications of artificial intelligence in diagnostic medicine. Her work has been published in leading medical journals."
        }
      ],
      agenda: [
        {
          time: "09:00 - 09:30",
          activity: "Registration and Welcome"
        },
        {
          time: "09:30 - 11:00",
          activity: "Keynote: The Future of Healthcare Innovation"
        },
        {
          time: "11:00 - 12:30",
          activity: "Panel: Digital Health Technologies"
        },
        {
          time: "12:30 - 13:30",
          activity: "Lunch Break and Networking"
        },
        {
          time: "13:30 - 15:00",
          activity: "Breakout Sessions by Specialty"
        },
        {
          time: "15:00 - 16:30",
          activity: "Innovation Showcase"
        },
        {
          time: "16:30 - 17:00",
          activity: "Closing Remarks"
        }
      ],
      comments: [
        {
          user: "Alex L.",
          text: "Will there be opportunities to connect with potential investors during the innovation showcase?",
          timestamp: "1 week ago"
        },
        {
          user: "Jordan P.",
          text: "Looking forward to the AI session. Will there be any hands-on demonstrations?",
          timestamp: "2 weeks ago"
        }
      ]
    },
    {
      id: 6,
      name: "Young Alumni Mixer",
      date: "2023-06-30",
      timeStart: "19:00",
      timeEnd: "22:00",
      location: "Urban Brewery Downtown",
      locationType: "in-person",
      type: "Networking",
      description: "A casual evening for recent graduates (classes of 2018-2023) to connect, network, and build relationships in a relaxed setting. Complimentary appetizers will be provided, and there will be a cash bar. Come meet fellow young alumni and expand your professional network!",
      shortDescription: "Casual networking evening for recent graduates featuring complimentary appetizers, cash bar, and opportunities to build relationships.",
      organizer: "Young Alumni Committee",
      organizerImage: "https://via.placeholder.com/50?text=YA",
      isFeatured: false,
      imageUrl: "https://via.placeholder.com/600x300?text=Young+Alumni+Mixer",
      attendees: 65,
      capacity: 80,
      speakers: [],
      agenda: [
        {
          time: "19:00 - 19:30",
          activity: "Arrival and Welcome"
        },
        {
          time: "19:30 - 21:30",
          activity: "Mixer and Networking"
        },
        {
          time: "21:30 - 22:00",
          activity: "Final Connections and Wrap-up"
        }
      ],
      comments: [
        {
          user: "Riley J.",
          text: "Is there a dress code for this event?",
          timestamp: "3 days ago"
        },
        {
          user: "Taylor S.",
          text: "Can we bring guests who didn't attend the university?",
          timestamp: "1 week ago"
        }
      ]
    }
  ];
  
  // Filter events based on search query and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' || 
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Date filtering
    const eventDate = new Date(event.date);
    const today = new Date();
    
    const matchesDate = 
      (dateFilter === 'upcoming' && eventDate > today) ||
      (dateFilter === 'past' && eventDate < today) ||
      (dateFilter === 'all');
      
    const matchesType = eventTypeFilter === '' || event.type === eventTypeFilter;
      
    return matchesSearch && matchesDate && matchesType;
  });
  
  // Get featured events
  const featuredEvents = events.filter(event => event.isFeatured);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Format time
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setActiveTab('details');
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  const resetFilters = () => {
    setDateFilter('upcoming');
    setEventTypeFilter('');
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the comment to a database
    alert(`Comment submitted: ${comment}`);
    setComment('');
  };
  
  // Get unique event types for filter
  const eventTypes = [...new Set(events.map(event => event.type))];

  return (
    <div className="ep-container">
      {/* Header/Nav */}
      <header className="ep-header">
        <div className="ep-nav-container">
          <div className="ep-logo">
            <a href="/" className="logo-link">
              <div className="logo-icon">
                <span>AC</span>
              </div>
              <span className="logo-text">Alumni Connect</span>
            </a>
          </div>
          
          <nav className="ep-nav">
            <a href="/" className="ep-nav-link">Home</a>
            <a href="/jobs" className="ep-nav-link">Job Board</a>
            <a href="/events" className="ep-nav-link active">Events</a>
            <a href="/profile" className="ep-nav-link">Profile</a>
          </nav>
          
          <div className="ep-auth-buttons">
            <a href="/login" className="ep-btn ep-btn-secondary">Login</a>
            <a href="/register" className="ep-btn ep-btn-primary">Register</a>
          </div>
          
          <button className="ep-mobile-menu-btn">
            <div className="ep-hamburger"></div>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="ep-hero">
        <div className="ep-hero-content">
          <h1>Discover Alumni Events</h1>
          <p>Connect, learn, and grow with your alumni community</p>
          
          <div className="ep-search-container">
            <div className="ep-search-box">
              <Search className="ep-search-icon" />
              <input 
                type="text" 
                placeholder="Search events, topics, or organizers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="ep-btn ep-btn-primary ep-search-btn">Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="ep-main">
        <div className="ep-container">
          {/* Featured Events */}
          {featuredEvents.length > 0 && (
            <section className="ep-featured-events">
              <h2 className="ep-section-title">Featured Events</h2>
              <div className="ep-featured-grid">
                {featuredEvents.map(event => (
                  <div key={event.id} className="ep-featured-card">
                    <div className="ep-featured-image">
                      <img src={event.imageUrl} alt={event.name} />
                      <div className="ep-featured-badge">
                        <Star size={14} />
                        <span>Featured</span>
                      </div>
                    </div>
                    <div className="ep-featured-content">
                      <h3>{event.name}</h3>
                      <div className="ep-featured-meta">
                        <div className="ep-meta-item">
                          <Calendar size={16} />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="ep-meta-item">
                          <Clock size={16} />
                          <span>{formatTime(event.timeStart)} - {formatTime(event.timeEnd)}</span>
                        </div>
                        <div className="ep-meta-item">
                          <MapPin size={16} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <p className="ep-featured-desc">{event.shortDescription}</p>
                      <div className="ep-featured-actions">
                        <button 
                          className="ep-btn ep-btn-primary"
                          onClick={() => handleViewDetails(event)}
                        >
                          View Details
                        </button>
                        <div className="ep-attendee-info">
                          <Users size={16} />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Mobile Filter Toggle */}
          <div className="ep-mobile-filter-toggle">
            <button 
              className="ep-btn ep-btn-secondary ep-filter-toggle-btn"
              onClick={toggleFilters}
            >
              <Filter size={18} />
              <span>Filters</span>
              {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          <div className="ep-content">
            {/* Filter Sidebar */}
            <aside className={`ep-sidebar ${showFilters ? 'ep-sidebar-show' : ''}`}>
              <div className="ep-filter-header">
                <h3>Filters</h3>
                <button 
                  className="ep-btn ep-btn-text"
                  onClick={resetFilters}
                >
                  Reset All
                </button>
              </div>
              
              {/* Date Filter */}
              <div className="ep-filter-group">
                <h4>Date</h4>
                <div className="ep-radio-group">
                  <label className="ep-radio">
                    <input 
                      type="radio" 
                      name="dateFilter" 
                      value="upcoming"
                      checked={dateFilter === 'upcoming'}
                      onChange={() => setDateFilter('upcoming')}
                    />
                    <span>Upcoming Events</span>
                  </label>
                  <label className="ep-radio">
                    <input 
                      type="radio" 
                      name="dateFilter" 
                      value="past"
                      checked={dateFilter === 'past'}
                      onChange={() => setDateFilter('past')}
                    />
                    <span>Past Events</span>
                  </label>
                  <label className="ep-radio">
                    <input 
                      type="radio" 
                      name="dateFilter" 
                      value="all"
                      checked={dateFilter === 'all'}
                      onChange={() => setDateFilter('all')}
                    />
                    <span>All Events</span>
                  </label>
                </div>
              </div>
              
              {/* Event Type Filter */}
              <div className="ep-filter-group">
                <h4>Event Type</h4>
                <select 
                  value={eventTypeFilter}
                  onChange={(e) => setEventTypeFilter(e.target.value)}
                  className="ep-select"
                >
                  <option value="">All Types</option>
                  {eventTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* Location Type Filter */}
              <div className="ep-filter-group">
                <h4>Location</h4>
                <div className="ep-radio-group">
                  <label className="ep-radio">
                    <input 
                      type="radio" 
                      name="locationType" 
                      value=""
                      checked={true}
                      onChange={() => {}}
                    />
                    <span>All Locations</span>
                  </label>
                  <label className="ep-radio">
                    <input 
                      type="radio" 
                      name="locationType" 
                      value="in-person"
                      checked={false}
                      onChange={() => {}}
                    />
                    <span>In-Person Only</span>
                  </label>
                  <label className="ep-radio">
                    <input 
                      type="radio" 
                      name="locationType" 
                      value="online"
                      checked={false}
                      onChange={() => {}}
                    />
                    <span>Virtual Only</span>
                  </label>
                </div>
              </div>
            </aside>
            
            {/* Event Listings */}
            <div className="ep-event-list">
              <div className="ep-event-count">
                <h2>{filteredEvents.length} Events Found</h2>
              </div>
              
              {filteredEvents.length === 0 ? (
                <div className="ep-no-results">
                  <p>No events match your current filters. Try adjusting your search criteria.</p>
                  <button 
                    className="ep-btn ep-btn-secondary"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="ep-event-grid">
                  {filteredEvents.map(event => (
                    <div key={event.id} className="ep-event-card">
                      <div className="ep-event-image">
                        <img src={event.imageUrl} alt={event.name} />
                        <div className="ep-event-type">
                          <span>{event.type}</span>
                        </div>
                      </div>
                      <div className="ep-event-content">
                        <div className="ep-event-date-badge">
                          <div className="ep-date-month">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="ep-date-day">
                            {new Date(event.date).getDate()}
                          </div>
                        </div>
                        
                        <h3 className="ep-event-title">{event.name}</h3>
                        
                        <div className="ep-event-details">
                          <div className="ep-detail-item">
                            <Clock size={16} />
                            <span>{formatTime(event.timeStart)} - {formatTime(event.timeEnd)}</span>
                          </div>
                          <div className="ep-detail-item">
                            <MapPin size={16} />
                            <span>{event.location}</span>
                          </div>
                          <div className="ep-detail-item">
                            <User size={16} />
                            <span>{event.organizer}</span>
                          </div>
                        </div>
                        
                        <p className="ep-event-description">{event.shortDescription}</p>
                        
                        <div className="ep-event-footer">
                          <button 
                            className="ep-btn ep-btn-primary"
                            onClick={() => handleViewDetails(event)}
                          >
                            View Details
                          </button>
                          <div className="ep-attendee-count">
                            <Users size={16} />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Create Event Button (Admin) */}
      <a href="/create-event" className="ep-create-event-btn">
        <Plus size={16} />
        <span>Create Event</span>
      </a>

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="ep-modal">
          <div className="ep-modal-backdrop" onClick={closeModal}></div>
          <div className="ep-modal-content">
            <button className="ep-modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            
            <div className="ep-modal-header">
              <img 
                src={selectedEvent.imageUrl} 
                alt={selectedEvent.name} 
                className="ep-modal-image" 
              />
              <div className="ep-modal-title-section">
                <div className="ep-event-type-badge">
                  {selectedEvent.type}
                </div>
                <h2>{selectedEvent.name}</h2>
                
                <div className="ep-modal-meta">
                  <div className="ep-meta-item">
                    <Calendar size={16} />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="ep-meta-item">
                    <Clock size={16} />
                    <span>{formatTime(selectedEvent.timeStart)} - {formatTime(selectedEvent.timeEnd)}</span>
                  </div>
                  <div className="ep-meta-item">
                    <MapPin size={16} />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="ep-meta-item">
                    <Users size={16} />
                    <span>{selectedEvent.attendees} attending</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ep-modal-tabs">
              <button 
                className={`ep-tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Event Details
              </button>
              <button 
                className={`ep-tab ${activeTab === 'speakers' ? 'active' : ''}`}
                onClick={() => setActiveTab('speakers')}
              >
                Speakers & Agenda
              </button>
              <button 
                className={`ep-tab ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Q&A ({selectedEvent.comments.length})
              </button>
            </div>
            
            <div className="ep-modal-body">
              {activeTab === 'details' && (
                <div className="ep-tab-content">
                  <section className="ep-event-section">
                    <h3>About This Event</h3>
                    <p>{selectedEvent.description}</p>
                  </section>
                  
                  <section className="ep-event-section">
                    <h3>Organizer</h3>
                    <div className="ep-organizer">
                      <img src={selectedEvent.organizerImage} alt={selectedEvent.organizer} />
                      <span>{selectedEvent.organizer}</span>
                    </div>
                  </section>
                  
                  <section className="ep-event-section">
                    <h3>Location</h3>
                    <div className="ep-location-info">
                      <MapPin size={18} />
                      <span>{selectedEvent.location}</span>
                    </div>
                    {selectedEvent.locationType === 'online' && (
                      <div className="ep-online-indicator">
                        <Globe size={18} />
                        <span>Virtual Event</span>
                      </div>
                    )}
                  </section>
                </div>
              )}
              
              {activeTab === 'speakers' && (
                <div className="ep-tab-content">
                  {selectedEvent.speakers && selectedEvent.speakers.length > 0 ? (
                    <section className="ep-event-section">
                      <h3>Speakers</h3>
                      <div className="ep-speakers-list">
                        {selectedEvent.speakers.map((speaker, index) => (
                          <div key={index} className="ep-speaker-card">
                            <img src={speaker.image} alt={speaker.name} className="ep-speaker-image" />
                            <div className="ep-speaker-info">
                              <h4>{speaker.name}</h4>
                              <p className="ep-speaker-title">{speaker.title}</p>
                              <p className="ep-speaker-bio">{speaker.bio}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : (
                    <p>No speakers are listed for this event.</p>
                  )}
                  
                  <section className="ep-event-section">
                    <h3>Event Agenda</h3>
                    <div className="ep-agenda">
                      {selectedEvent.agenda.map((item, index) => (
                        <div key={index} className="ep-agenda-item">
                          <div className="ep-agenda-time">{item.time}</div>
                          <div className="ep-agenda-activity">{item.activity}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
              
              {activeTab === 'comments' && (
                <div className="ep-tab-content">
                  <section className="ep-event-section">
                    <h3>Questions & Comments</h3>
                    
                    <div className="ep-comment-form">
                      <h4>Ask a Question</h4>
                      <form onSubmit={handleCommentSubmit}>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Type your question or comment here..."
                          rows={3}
                          required
                        ></textarea>
                        <button type="submit" className="ep-btn ep-btn-primary">
                          Submit
                        </button>
                      </form>
                    </div>
                    
                    <div className="ep-comments-list">
                      {selectedEvent.comments.map((comment, index) => (
                        <div key={index} className="ep-comment">
                          <div className="ep-comment-header">
                            <div className="ep-comment-user">
                              <MessageCircle size={16} />
                              <span>{comment.user}</span>
                            </div>
                            <div className="ep-comment-time">{comment.timestamp}</div>
                          </div>
                          <p className="ep-comment-text">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
            
            <div className="ep-modal-footer">
              <button className="ep-btn ep-btn-primary ep-register-btn">
                Register to Attend
              </button>
              
              <div className="ep-capacity-info">
                <div className="ep-capacity-text">
                  <span className="ep-capacity-count">{selectedEvent.attendees}/{selectedEvent.capacity}</span> spots filled
                </div>
                <div className="ep-capacity-bar">
                  <div 
                    className="ep-capacity-progress" 
                    style={{width: `${(selectedEvent.attendees / selectedEvent.capacity) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="ep-footer">
        <div className="ep-container">
          <div className="ep-footer-content">
            <div className="ep-footer-logo">
              <div className="ep-logo">
                <div className="logo-icon">
                  <span>AC</span>
                </div>
                <span className="logo-text">Alumni Connect</span>
              </div>
              <p>Connecting alumni with opportunities since 2020</p>
            </div>
            
            <div className="ep-footer-links">
              <div className="ep-footer-column">
                <h4>Navigate</h4>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="/jobs">Job Board</a></li>
                  <li><a href="/events">Events</a></li>
                  <li><a href="/alumni">Alumni Directory</a></li>
                </ul>
              </div>
              
              <div className="ep-footer-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="/career">Career Resources</a></li>
                  <li><a href="/mentorship">Mentorship</a></li>
                  <li><a href="/faq">FAQ</a></li>
                  <li><a href="/support">Support</a></li>
                </ul>
              </div>
              
              <div className="ep-footer-column">
                <h4>Contact Us</h4>
                <ul className="ep-contact-info">
                  <li>
                    <Mail size={16} />
                    <span>contact@alumniconnect.edu</span>
                  </li>
                  <li>
                    <Phone size={16} />
                    <span>(123) 456-7890</span>
                  </li>
                </ul>
                <div className="ep-social-links">
                  <a href="#" className="ep-social-link"><Facebook size={18} /></a>
                  <a href="#" className="ep-social-link"><Twitter size={18} /></a>
                  <a href="#" className="ep-social-link"><Linkedin size={18} /></a>
                  <a href="#" className="ep-social-link"><Instagram size={18} /></a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="ep-footer-bottom">
            <p>&copy; {new Date().getFullYear()} Alumni Connect. All rights reserved.</p>
            <div className="ep-legal-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventsPage;