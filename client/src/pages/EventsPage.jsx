import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Search, MapPin, Calendar, Clock, User, Filter, X,
  ChevronDown, ChevronUp, Users, Globe, Plus, Trash2, Loader2
} from "lucide-react";

import "./EventsPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CreateEventModal from "./CreateEventModal";
import { AuthContext } from "../contexts/AuthContextProvider";

const EventsPage = () => {
  const { user, role } = useContext(AuthContext);

  // --- COMPONENT STATE ---
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // --- FILTER STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("upcoming");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [locationTypeFilter, setLocationTypeFilter] = useState("");

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:3000/api/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Could not load events.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // --- EVENT HANDLERS ---
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Event deleted successfully.");
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.response?.data?.message || "Failed to delete event.");
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const handleRegister = async (eventId) => {
    setIsRegistering(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:3000/api/events/${eventId}/register`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(data.message);
      
      setEvents(prevEvents => prevEvents.map(event => 
        event._id === eventId ? data.event : event
      ));
      
      if(selectedEvent?._id === eventId) {
        setSelectedEvent(data.event);
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsRegistering(false);
    }
  };

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
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleViewDetails = (event) => { setSelectedEvent(event); setShowModal(true); };
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
              <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
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
                  <label className="ep-radio"><input type="radio" name="dateFilter" value="upcoming" checked={dateFilter === "upcoming"} onChange={() => setDateFilter("upcoming")} /><span>Upcoming</span></label>
                  <label className="ep-radio"><input type="radio" name="dateFilter" value="past" checked={dateFilter === "past"} onChange={() => setDateFilter("past")} /><span>Past</span></label>
                  <label className="ep-radio"><input type="radio" name="dateFilter" value="all" checked={dateFilter === "all"} onChange={() => setDateFilter("all")} /><span>All</span></label>
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
                  <label className="ep-radio"><input type="radio" name="locationType" value="" checked={locationTypeFilter === ''} onChange={() => setLocationTypeFilter('')} /><span>All</span></label>
                  <label className="ep-radio"><input type="radio" name="locationType" value="in-person" checked={locationTypeFilter === 'in-person'} onChange={() => setLocationTypeFilter('in-person')} /><span>In-Person</span></label>
                  <label className="ep-radio"><input type="radio" name="locationType" value="online" checked={locationTypeFilter === 'online'} onChange={() => setLocationTypeFilter('online')} /><span>Virtual</span></label>
                </div>
              </div>
            </aside>

            <div className="ep-event-list">
              <div className="ep-event-count"><h2>{filteredEvents.length} Events Found</h2></div>
              {isLoading ? (
                  <div style={{textAlign: 'center', padding: '2rem'}}><Loader2 className="animate-spin" size={32} /></div>
              ) : filteredEvents.length === 0 ? (
                <div className="ep-no-results">
                  <p>No events match your current filters. Try adjusting them.</p>
                  <button className="ep-btn ep-btn-secondary" onClick={resetFilters}>Reset Filters</button>
                </div>
              ) : (
                <div className="ep-event-grid">
                  {filteredEvents.map((event) => (
                    <div key={event._id} className="ep-event-card">
                      {user && event.createdBy && user.id === event.createdBy._id && (
                          <button onClick={() => handleDeleteEvent(event._id)} className="ep-delete-btn" title="Delete Event">
                              <Trash2 size={18} />
                          </button>
                      )}
                      <div className="ep-event-image">
                        <img src={event.imageUrl || 'https://via.placeholder.com/600x400'} alt={event.name} />
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
                          <div className="ep-attendee-count"><Users size={16} /><span>{event.attendees.length} attending</span></div>
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
        <button onClick={() => setShowCreateModal(true)} className="ep-create-event-btn">
          <Plus size={16} /><span>Create Event</span>
        </button>
      )}

      {showCreateModal && <CreateEventModal onClose={() => setShowCreateModal(false)} onEventCreated={handleEventCreated} />}
      
      {showModal && selectedEvent && (
        <div className="ep-modal">
          <div className="ep-modal-backdrop" onClick={closeModal}></div>
          <div className="ep-modal-content">
            <button className="ep-modal-close" onClick={closeModal}><X size={24} /></button>
            <div className="ep-modal-header">
              <img src={selectedEvent.imageUrl || 'https://via.placeholder.com/600x400'} alt={selectedEvent.name} className="ep-modal-image" />
              <div className="ep-modal-title-section">
                <div className="ep-event-type-badge">{selectedEvent.type}</div>
                <h2>{selectedEvent.name}</h2>
                <div className="ep-modal-meta">
                  <div className="ep-meta-item"><Calendar size={16} /><span>{formatDate(selectedEvent.date)}</span></div>
                  <div className="ep-meta-item"><Clock size={16} /><span>{formatTime(selectedEvent.timeStart)} - {formatTime(selectedEvent.timeEnd)}</span></div>
                  <div className="ep-meta-item"><MapPin size={16} /><span>{selectedEvent.location}</span></div>
                  <div className="ep-meta-item"><Users size={16} /><span>{selectedEvent.attendees.length} attending</span></div>
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
                    <img src={selectedEvent.organizerImage || 'https://via.placeholder.com/50'} alt={selectedEvent.organizer} />
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
              {/* --- THIS IS THE CORRECTED LOGIC --- */}
              {user && selectedEvent.attendees.includes(user.id) ? (
                  <button className="ep-btn ep-register-btn registered" disabled>You are registered</button>
              ) : (
                <button 
                  className="ep-btn ep-btn-primary ep-register-btn" 
                  onClick={() => handleRegister(selectedEvent._id)}
                  disabled={isRegistering}
                >
                  {isRegistering ? <Loader2 className="animate-spin" size={18}/> : 'Register to Attend'}
                </button>
              )}
              <div className="ep-capacity-info">
                <div className="ep-capacity-text">
                  <span className="ep-capacity-count">{selectedEvent.attendees.length}/{selectedEvent.capacity}</span> spots filled
                </div>
                <div className="ep-capacity-bar">
                  <div className="ep-capacity-progress" style={{ width: `${(selectedEvent.attendees.length / (selectedEvent.capacity || 1)) * 100}%` }}></div>
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

