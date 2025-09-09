import React, { useState, useContext } from "react";
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
  Plus,
} from "lucide-react";
import "./EventsPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../contexts/AuthContextProvider";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  // States for UI
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("upcoming");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [locationTypeFilter, setLocationTypeFilter] = useState("");

  // Mock event data
  const events = [
    {
      id: 1,
      name: "Tech Industry Networking Night",
      date: "2025-11-15",
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
      imageUrl:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      attendees: 78,
      capacity: 100,
    },
    {
      id: 2,
      name: "Annual Alumni Reunion",
      date: "2026-01-22",
      timeStart: "12:00",
      timeEnd: "22:00",
      location: "Online via Zoom",
      locationType: "online",
      type: "Reunion",
      description:
        "Join fellow alumni for our biggest event of the year! The Annual Alumni Reunion brings together graduates from all years for a day of celebration, reminiscing, and reconnecting.",
      shortDescription:
        "The biggest alumni event of the year with activities, dinner, and entertainment for graduates from all class years.",
      organizer: "University Alumni Association",
      organizerImage: "https://via.placeholder.com/50?text=AA",
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      attendees: 245,
      capacity: 500,
    },
    {
      id: 3,
      name: "Past Workshop: Intro to AI",
      date: "2024-05-20",
      timeStart: "10:00",
      timeEnd: "13:00",
      location: "Engineering Building, Room 301",
      locationType: "in-person",
      type: "Workshop",
      description: "A past workshop on Artificial Intelligence.",
      shortDescription: "A past workshop on Artificial Intelligence.",
      organizer: "CS Department",
      organizerImage: "https://via.placeholder.com/50?text=CS",
      imageUrl:
        "https://images.unsplash.com/photo-1593349480503-68c674c86a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      attendees: 50,
      capacity: 50,
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchesDate =
      (dateFilter === "upcoming" && eventDate >= today) ||
      (dateFilter === "past" && eventDate < today) ||
      dateFilter === "all";

    const matchesType = eventTypeFilter === "" || event.type === eventTypeFilter;
    const matchesLocation = locationTypeFilter === "" || event.locationType === locationTypeFilter;

    return matchesSearch && matchesDate && matchesType && matchesLocation;
  });

  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

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
  };

  const closeModal = () => setShowModal(false);
  const resetFilters = () => {
    setDateFilter("upcoming");
    setEventTypeFilter("");
    setLocationTypeFilter("");
    setSearchQuery("");
  };
  const toggleFilters = () => setShowFilters(!showFilters);

  const eventTypes = [...new Set(events.map((event) => event.type))];

  return (
    <div className="events-page">
      <Header />
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

      <main className="ep-main">
        <div className="ep-container">
          <div className="ep-mobile-filter-toggle">
            <button className="ep-btn ep-btn-secondary ep-filter-toggle-btn" onClick={toggleFilters}>
              <Filter size={18} /><span>Filters</span>{showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          <div className="ep-content">
            <aside className={`ep-sidebar ${showFilters ? "ep-sidebar-show" : ""}`}>
              <div className="ep-filter-header">
                <h3>Filters</h3>
                <button className="ep-btn ep-btn-text" onClick={resetFilters}>Reset All</button>
              </div>
              <div className="ep-filter-group">
                <h4>Date</h4>
                <div className="ep-radio-group">
                  <label className="ep-radio"><input type="radio" name="dateFilter" value="upcoming" checked={dateFilter === "upcoming"} onChange={() => setDateFilter("upcoming")} /><span>Upcoming Events</span></label>
                  <label className="ep-radio"><input type="radio" name="dateFilter" value="past" checked={dateFilter === "past"} onChange={() => setDateFilter("past")} /><span>Past Events</span></label>
                  <label className="ep-radio"><input type="radio" name="dateFilter" value="all" checked={dateFilter === "all"} onChange={() => setDateFilter("all")} /><span>All Events</span></label>
                </div>
              </div>
              <div className="ep-filter-group">
                <h4>Event Type</h4>
                <select value={eventTypeFilter} onChange={(e) => setEventTypeFilter(e.target.value)} className="ep-select">
                  <option value="">All Types</option>
                  {eventTypes.map((type, index) => (<option key={index} value={type}>{type}</option>))}
                </select>
              </div>
              <div className="ep-filter-group">
                <h4>Location</h4>
                <div className="ep-radio-group">
                  <label className="ep-radio"><input type="radio" name="locationType" value="" checked={locationTypeFilter === ''} onChange={() => setLocationTypeFilter('')} /><span>All Locations</span></label>
                  <label className="ep-radio"><input type="radio" name="locationType" value="in-person" checked={locationTypeFilter === 'in-person'} onChange={() => setLocationTypeFilter('in-person')} /><span>In-Person Only</span></label>
                  <label className="ep-radio"><input type="radio" name="locationType" value="online" checked={locationTypeFilter === 'online'} onChange={() => setLocationTypeFilter('online')} /><span>Virtual Only</span></label>
                </div>
              </div>
            </aside>

            <div className="ep-event-list">
              <div className="ep-event-count"><h2>{filteredEvents.length} Events Found</h2></div>
              {filteredEvents.length === 0 ? (
                <div className="ep-no-results">
                  <p>No events match your current filters. Try adjusting your search criteria.</p>
                  <button className="ep-btn ep-btn-secondary" onClick={resetFilters}>Reset Filters</button>
                </div>
              ) : (
                <div className="ep-event-grid">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="ep-event-card">
                      <div className="ep-event-image">
                        <img src={event.imageUrl} alt={event.name} />
                        <div className="ep-event-type"><span>{event.type}</span></div>
                      </div>
                      <div className="ep-event-content">
                        <div className="ep-event-date-badge">
                          <div className="ep-date-month">{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</div>
                          <div className="ep-date-day">{new Date(event.date).getDate()}</div>
                        </div>
                        <h3 className="ep-event-title">{event.name}</h3>
                        <div className="ep-event-details">
                          <div className="ep-detail-item"><Clock size={16} /><span>{formatTime(event.timeStart)} - {formatTime(event.timeEnd)}</span></div>
                          <div className="ep-detail-item"><MapPin size={16} /><span>{event.location}</span></div>
                          <div className="ep-detail-item"><User size={16} /><span>{event.organizer}</span></div>
                        </div>
                        <p className="ep-event-description">{event.shortDescription}</p>
                        <div className="ep-event-footer">
                          <button className="ep-btn ep-btn-primary" onClick={() => handleViewDetails(event)}>View Details</button>
                          <div className="ep-attendee-count"><Users size={16} /><span>{event.attendees} attending</span></div>
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

      {role === "alumni" && (
        <button className="ep-create-event-btn"><Plus size={16} /><span>Create Event</span></button>
      )}

      {showModal && selectedEvent && (
        <div className="ep-modal">
          <div className="ep-modal-backdrop" onClick={closeModal}></div>
          <div className="ep-modal-content">
            <button className="ep-modal-close" onClick={closeModal}><X size={24} /></button>
            <div className="ep-modal-header">
              <img src={selectedEvent.imageUrl} alt={selectedEvent.name} className="ep-modal-image" />
              <div className="ep-modal-title-section">
                <div className="ep-event-type-badge">{selectedEvent.type}</div>
                <h2>{selectedEvent.name}</h2>
                <div className="ep-modal-meta">
                  <div className="ep-meta-item"><Calendar size={16} /><span>{formatDate(selectedEvent.date)}</span></div>
                  <div className="ep-meta-item"><Clock size={16} /><span>{formatTime(selectedEvent.timeStart)} - {formatTime(selectedEvent.timeEnd)}</span></div>
                  <div className="ep-meta-item"><MapPin size={16} /><span>{selectedEvent.location}</span></div>
                  <div className="ep-meta-item"><Users size={16} /><span>{selectedEvent.attendees} attending</span></div>
                </div>
              </div>
            </div>
            
            <div className="ep-modal-body">
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
                    <MapPin size={18} /><span>{selectedEvent.location}</span>
                  </div>
                  {selectedEvent.locationType === "online" && (
                    <div className="ep-online-indicator"><Globe size={18} /><span>Virtual Event</span></div>
                  )}
                </section>
              </div>
            </div>

            <div className="ep-modal-footer">
              <button className="ep-btn ep-btn-primary ep-register-btn">Register to Attend</button>
              <div className="ep-capacity-info">
                <div className="ep-capacity-text">
                  <span className="ep-capacity-count">{selectedEvent.attendees}/{selectedEvent.capacity}</span> spots filled
                </div>
                <div className="ep-capacity-bar">
                  <div className="ep-capacity-progress" style={{ width: `${(selectedEvent.attendees / selectedEvent.capacity) * 100}%` }}></div>
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

