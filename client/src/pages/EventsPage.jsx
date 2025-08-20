import React, { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  User,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Users,
  Globe,
  Star,
  MessageCircle,
  Plus,
} from "lucide-react";
import "./EventsPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../contexts/AuthContextProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  // States for UI
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [comment, setComment] = useState("");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("upcoming");
  const [eventTypeFilter, setEventTypeFilter] = useState("");

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
      description:
        "Join us for an evening of networking with tech industry professionals. This is your chance to connect with alumni working at top tech companies and explore potential career opportunities.",
      shortDescription:
        "Connect with alumni from leading tech companies and explore career opportunities in a relaxed setting.",
      organizer: "Alumni Association Tech Chapter",
      organizerImage: "https://via.placeholder.com/50?text=TC",
      isFeatured: true,
      imageUrl:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      attendees: 78,
      capacity: 100,
      speakers: [
        {
          name: "Sarah Johnson",
          title: "Senior Software Engineer at Google",
          image: "https://via.placeholder.com/100?text=SJ",
          bio: "Sarah is a senior software engineer at Google with 8 years of experience in cloud technologies. She graduated from our university in 2015 with a degree in Computer Science.",
        },
        {
          name: "Michael Chen",
          title: "Product Manager at Microsoft",
          image: "https://via.placeholder.com/100?text=MC",
          bio: "Michael has been leading product teams at Microsoft for 5 years. He holds an MBA from our university and a bachelor's degree in Computer Engineering.",
        },
      ],
      agenda: [
        {
          time: "18:00 - 18:30",
          activity: "Registration and Welcome Drinks",
        },
        {
          time: "18:30 - 19:15",
          activity: "Panel Discussion: Trends in Tech Industry",
        },
        {
          time: "19:15 - 20:30",
          activity: "Networking Session",
        },
        {
          time: "20:30 - 21:00",
          activity: "Closing Remarks and Final Networking",
        },
      ],
      comments: [
        {
          user: "Alex P.",
          text: "Looking forward to this event! Will there be representatives from startups as well?",
          timestamp: "2 days ago",
        },
        {
          user: "Jamie L.",
          text: "Last year's event was fantastic, definitely not missing this one.",
          timestamp: "1 week ago",
        },
      ],
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
      description:
        "Join fellow alumni for our biggest event of the year! The Annual Alumni Reunion brings together graduates from all years for a day of celebration, reminiscing, and reconnecting. The event includes campus tours, class-specific gatherings, dinner, and evening entertainment.",
      shortDescription:
        "The biggest alumni event of the year with activities, dinner, and entertainment for graduates from all class years.",
      organizer: "University Alumni Association",
      organizerImage: "https://via.placeholder.com/50?text=AA",
      isFeatured: true,
      imageUrl:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      attendees: 245,
      capacity: 500,
      speakers: [
        {
          name: "Dr. Robert Wilson",
          title: "University President",
          image: "https://via.placeholder.com/100?text=RW",
          bio: "Dr. Wilson has been the university president since 2018. He is committed to strengthening the connection between the university and its alumni community.",
        },
      ],
      agenda: [
        {
          time: "12:00 - 14:00",
          activity: "Registration and Welcome Lunch",
        },
        {
          time: "14:00 - 16:00",
          activity: "Campus Tours and Class Gatherings",
        },
        {
          time: "16:00 - 18:00",
          activity: "Alumni Achievement Awards",
        },
        {
          time: "18:00 - 20:00",
          activity: "Dinner and Keynote Speech",
        },
        {
          time: "20:00 - 22:00",
          activity: "Evening Entertainment and Socializing",
        },
      ],
      comments: [
        {
          user: "Taylor M.",
          text: "Will there be special activities for the class of 2013? It's our 10-year reunion!",
          timestamp: "3 days ago",
        },
        {
          user: "Jordan K.",
          text: "Can't wait to see everyone again! Flying in from Seattle for this.",
          timestamp: "1 week ago",
        },
      ],
    },
  ];

  // Filter events based on search query and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.shortDescription
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    // Date filtering
    const eventDate = new Date(event.date);
    const today = new Date();

    const matchesDate =
      (dateFilter === "upcoming" && eventDate > today) ||
      (dateFilter === "past" && eventDate < today) ||
      dateFilter === "all";

    const matchesType =
      eventTypeFilter === "" || event.type === eventTypeFilter;

    return matchesSearch && matchesDate && matchesType;
  });

  // Get featured events
  const featuredEvents = events.filter((event) => event.isFeatured);

  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setActiveTab("details");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const resetFilters = () => {
    setDateFilter("upcoming");
    setEventTypeFilter("");
    setSearchQuery("");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit the comment to a database
    alert(`Comment submitted: ${comment}`);
    setComment("");
  };

  // Get unique event types for filter
  const eventTypes = [...new Set(events.map((event) => event.type))];

  return (
    <div className="events-page">
      {/* Header */}
      <Header />

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
              <button className="ep-btn ep-btn-primary ep-search-btn">
                Search
              </button>
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
                {featuredEvents.map((event) => (
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
                          <span>
                            {formatTime(event.timeStart)} -{" "}
                            {formatTime(event.timeEnd)}
                          </span>
                        </div>
                        <div className="ep-meta-item">
                          <MapPin size={16} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <p className="ep-featured-desc">
                        {event.shortDescription}
                      </p>
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
              {showFilters ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>

          <div className="ep-content">
            {/* Filter Sidebar */}
            <aside
              className={`ep-sidebar ${showFilters ? "ep-sidebar-show" : ""}`}
            >
              <div className="ep-filter-header">
                <h3>Filters</h3>
                <button className="ep-btn ep-btn-text" onClick={resetFilters}>
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
                      checked={dateFilter === "upcoming"}
                      onChange={() => setDateFilter("upcoming")}
                    />
                    <span>Upcoming Events</span>
                  </label>
                  <label className="ep-radio">
                    <input
                      type="radio"
                      name="dateFilter"
                      value="past"
                      checked={dateFilter === "past"}
                      onChange={() => setDateFilter("past")}
                    />
                    <span>Past Events</span>
                  </label>
                  <label className="ep-radio">
                    <input
                      type="radio"
                      name="dateFilter"
                      value="all"
                      checked={dateFilter === "all"}
                      onChange={() => setDateFilter("all")}
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
                    <option key={index} value={type}>
                      {type}
                    </option>
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
                      defaultChecked
                    />
                    <span>All Locations</span>
                  </label>
                  <label className="ep-radio">
                    <input type="radio" name="locationType" value="in-person" />
                    <span>In-Person Only</span>
                  </label>
                  <label className="ep-radio">
                    <input type="radio" name="locationType" value="online" />
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
                  <p>
                    No events match your current filters. Try adjusting your
                    search criteria.
                  </p>
                  <button
                    className="ep-btn ep-btn-secondary"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="ep-event-grid">
                  {filteredEvents.map((event) => (
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
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                            })}
                          </div>
                          <div className="ep-date-day">
                            {new Date(event.date).getDate()}
                          </div>
                        </div>

                        <h3 className="ep-event-title">{event.name}</h3>

                        <div className="ep-event-details">
                          <div className="ep-detail-item">
                            <Clock size={16} />
                            <span>
                              {formatTime(event.timeStart)} -{" "}
                              {formatTime(event.timeEnd)}
                            </span>
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

                        <p className="ep-event-description">
                          {event.shortDescription}
                        </p>

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

      {/* Create Event Button */}
      {role == "alumni" && (
        <button className="ep-create-event-btn">
          <Plus size={16} />
          <span>Create Event</span>
        </button>
      )}

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
                <div className="ep-event-type-badge">{selectedEvent.type}</div>
                <h2>{selectedEvent.name}</h2>

                <div className="ep-modal-meta">
                  <div className="ep-meta-item">
                    <Calendar size={16} />
                    <span>{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="ep-meta-item">
                    <Clock size={16} />
                    <span>
                      {formatTime(selectedEvent.timeStart)} -{" "}
                      {formatTime(selectedEvent.timeEnd)}
                    </span>
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
                className={`ep-tab ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                Event Details
              </button>
              <button
                className={`ep-tab ${activeTab === "speakers" ? "active" : ""}`}
                onClick={() => setActiveTab("speakers")}
              >
                Speakers & Agenda
              </button>
              <button
                className={`ep-tab ${activeTab === "comments" ? "active" : ""}`}
                onClick={() => setActiveTab("comments")}
              >
                Q&A ({selectedEvent.comments.length})
              </button>
            </div>

            <div className="ep-modal-body">
              {activeTab === "details" && (
                <div className="ep-tab-content">
                  <section className="ep-event-section">
                    <h3>About This Event</h3>
                    <p>{selectedEvent.description}</p>
                  </section>

                  <section className="ep-event-section">
                    <h3>Organizer</h3>
                    <div className="ep-organizer">
                      <img
                        src={selectedEvent.organizerImage}
                        alt={selectedEvent.organizer}
                      />
                      <span>{selectedEvent.organizer}</span>
                    </div>
                  </section>

                  <section className="ep-event-section">
                    <h3>Location</h3>
                    <div className="ep-location-info">
                      <MapPin size={18} />
                      <span>{selectedEvent.location}</span>
                    </div>
                    {selectedEvent.locationType === "online" && (
                      <div className="ep-online-indicator">
                        <Globe size={18} />
                        <span>Virtual Event</span>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {activeTab === "speakers" && (
                <div className="ep-tab-content">
                  {selectedEvent.speakers &&
                  selectedEvent.speakers.length > 0 ? (
                    <section className="ep-event-section">
                      <h3>Speakers</h3>
                      <div className="ep-speakers-list">
                        {selectedEvent.speakers.map((speaker, index) => (
                          <div key={index} className="ep-speaker-card">
                            <img
                              src={speaker.image}
                              alt={speaker.name}
                              className="ep-speaker-image"
                            />
                            <div className="ep-speaker-info">
                              <h4>{speaker.name}</h4>
                              <p className="ep-speaker-title">
                                {speaker.title}
                              </p>
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
                          <div className="ep-agenda-activity">
                            {item.activity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "comments" && (
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
                            <div className="ep-comment-time">
                              {comment.timestamp}
                            </div>
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
                  <span className="ep-capacity-count">
                    {selectedEvent.attendees}/{selectedEvent.capacity}
                  </span>{" "}
                  spots filled
                </div>
                <div className="ep-capacity-bar">
                  <div
                    className="ep-capacity-progress"
                    style={{
                      width: `${
                        (selectedEvent.attendees / selectedEvent.capacity) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default EventsPage;
