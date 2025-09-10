const Event = require('../models/eventModel');

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Alumni only)
 */
exports.createEvent = async (req, res) => {
  try {
    // Add the logged-in user's ID as the 'createdBy' field
    const eventData = { ...req.body, createdBy: req.user.id };
    
    const newEvent = new Event(eventData);
    await newEvent.save();

    res.status(201).json({ success: true, message: 'Event created successfully!', event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Private
 */
exports.getAllEvents = async (req, res) => {
  try {
    // We use .populate() to replace the 'createdBy' ID with an object.
    // We select just the '_id' from that user object to keep the payload lean.
    const events = await Event.find({})
      .populate('createdBy', '_id') // <-- This is the crucial line
      .sort({ date: 1 }); // Sort by upcoming date
    
    res.status(200).json({ 
        success: true, 
        count: events.length,
        events 
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (Creator of the event only)
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    // If event doesn't exist
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // --- CRUCIAL SECURITY CHECK ---
    // Check if the logged-in user is the one who created the event.
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'User not authorized to delete this event.' });
    }

    await event.deleteOne(); // Use deleteOne() on the document

    res.status(200).json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Register the current user for an event
 * @route   POST /api/events/:id/register
 * @access  Private
 */
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const userId = req.user.id;

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if user is already registered
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'You are already registered for this event.' });
    }

    // Check if event is full
    if (event.capacity > 0 && event.attendees.length >= event.capacity) {
        return res.status(400).json({ message: 'This event is already full.' });
    }

    // Add the user to the attendees list using $addToSet to prevent duplicates
    event.attendees.push(userId);
    await event.save();

    res.status(200).json({ success: true, message: 'Successfully registered for the event!', event });

  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};