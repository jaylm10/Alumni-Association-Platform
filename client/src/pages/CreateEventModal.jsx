import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, Loader2 } from 'lucide-react';
import './CreateEventModal.css';

const CreateEventModal = ({ onClose, onEventCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    timeStart: '18:00',
    timeEnd: '21:00',
    location: '',
    locationType: 'in-person',
    type: 'Networking',
    description: '',
    shortDescription: '',
    organizer: '',
    imageUrl: '',
    capacity: 100,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:3000/api/events', eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(data.message);
      onEventCreated(data.event); // Pass the new event back to the parent
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cem-modal-backdrop">
      <div className="cem-modal-content">
        <div className="cem-modal-header">
          <h2>Create a New Event</h2>
          <button onClick={onClose} className="cem-modal-close-btn"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="cem-modal-form">
          <div className="cem-form-grid">
            <div className="cem-form-group span-2">
              <label htmlFor="name">Event Name</label>
              <input type="text" id="name" name="name" value={eventData.name} onChange={handleChange} required />
            </div>
            <div className="cem-form-group">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" name="date" value={eventData.date} onChange={handleChange} required />
            </div>
            <div className="cem-form-group">
              <label htmlFor="type">Event Type</label>
              <input type="text" id="type" name="type" placeholder="e.g., Networking, Workshop" value={eventData.type} onChange={handleChange} required />
            </div>
            <div className="cem-form-group">
              <label htmlFor="timeStart">Start Time</label>
              <input type="time" id="timeStart" name="timeStart" value={eventData.timeStart} onChange={handleChange} required />
            </div>
            <div className="cem-form-group">
              <label htmlFor="timeEnd">End Time</label>
              <input type="time" id="timeEnd" name="timeEnd" value={eventData.timeEnd} onChange={handleChange} required />
            </div>
            <div className="cem-form-group span-2">
              <label htmlFor="location">Location / URL</label>
              <input type="text" id="location" name="location" placeholder="e.g., University Hall or Zoom Link" value={eventData.location} onChange={handleChange} required />
            </div>
             <div className="cem-form-group">
              <label htmlFor="locationType">Location Type</label>
              <select id="locationType" name="locationType" value={eventData.locationType} onChange={handleChange}>
                <option value="in-person">In-Person</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div className="cem-form-group">
              <label htmlFor="capacity">Capacity</label>
              <input type="number" id="capacity" name="capacity" value={eventData.capacity} onChange={handleChange} />
            </div>
            <div className="cem-form-group span-2">
              <label htmlFor="shortDescription">Short Description (for cards)</label>
              <input type="text" id="shortDescription" name="shortDescription" value={eventData.shortDescription} onChange={handleChange} maxLength="120" required />
            </div>
            <div className="cem-form-group span-2">
              <label htmlFor="description">Full Description</label>
              <textarea id="description" name="description" value={eventData.description} onChange={handleChange} rows="4" required></textarea>
            </div>
            <div className="cem-form-group span-2">
              <label htmlFor="imageUrl">Image URL (Optional)</label>
              <input type="url" id="imageUrl" name="imageUrl" placeholder="https://images.unsplash.com/..." value={eventData.imageUrl} onChange={handleChange} />
            </div>
            <div className="cem-form-group span-2">
              <label htmlFor="organizer">Organizer Name</label>
              <input type="text" id="organizer" name="organizer" placeholder="e.g., Your Name or Department" value={eventData.organizer} onChange={handleChange} required />
            </div>
          </div>
          <div className="cem-modal-footer">
            <button type="button" className="cem-btn cem-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="cem-btn cem-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
