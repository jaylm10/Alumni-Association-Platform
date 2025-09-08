const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const mongoose = require('mongoose');

/**
 * @desc    Start a new or find an existing conversation
 * @route   POST /api/conversations/start
 * @access  Private
 * This is called when a user clicks "Send Message" on a profile.
 */
exports.startConversation = async (req, res) => {
  const { recipientId } = req.body;
  const senderId = req.user.id; // From authMiddleware

  if (!recipientId) {
    return res.status(400).json({ message: "Recipient ID is required." });
  }

  // Ensure recipientId is a valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(recipientId)) {
    return res.status(400).json({ message: 'Invalid recipient ID format.' });
  }

  try {
    // Find if a conversation between these two users already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] }
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
      });
      await conversation.save();
    }

    // Return the conversation (either existing or newly created)
    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


/**
 * @desc    Get all conversations for the logged-in user
 * @route   GET /api/conversations
 * @access  Private
 * This is used to populate the message list on the left panel of the messages page.
 */
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find all conversations where the user is a participant
        // Populate the participant details but exclude the password
        // Sort by the most recently updated conversation
        const conversations = await Conversation.find({ participants: userId })
            .populate({
                path: 'participants',
                select: 'name role profilePictureUrl' // Assuming your user model has a profile picture field
            })
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            conversations,
        });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/**
 * @desc    Get all messages for a specific conversation
 * @route   GET /api/conversations/:id/messages
 * @access  Private
 */
exports.getMessagesForConversation = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        const userId = req.user.id;

        // First, check if the conversation exists and if the user is part of it
        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.includes(userId)) {
            return res.status(404).json({ message: "Conversation not found or you are not a participant." });
        }

        // Fetch all messages that belong to this conversation
        const messages = await Message.find({ conversationId })
            .populate('senderId', 'name profilePictureUrl') // Get sender's details
            .sort({ createdAt: 'asc' }); // Show oldest messages first

        res.status(200).json({
            success: true,
            messages,
        });

    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/**
 * @desc    Create a new message in a conversation
 * @route   POST /api/conversations/messages
 * @access  Private
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const senderId = req.user.id; // Get sender from the authenticated user token

    // 1. Create the new message document
    const newMessage = new Message({
      conversationId,
      senderId,
      message,
    });

    // 2. Save the message and update the conversation's `messages` array and `lastMessage` field.
    // We run these in parallel for better performance.
    const [savedMessage] = await Promise.all([
      newMessage.save(),
      Conversation.findByIdAndUpdate(conversationId, {
        $push: { messages: newMessage._id },
        lastMessage: message, // This updates the preview in the conversation list
      }),
    ]);

    // 3. Populate the sender's info on the message before sending it back.
    // This is crucial so the frontend receives the message in the same format
    // as when it fetches the message history.
    const populatedMessage = await Message.findById(savedMessage._id).populate(
      'senderId',
      'name profilePictureUrl'
    );

    // The socket event will be handled separately for real-time, but the API must
    // return the created message so the sender's UI can update instantly.
    res.status(201).json({ success: true, message: populatedMessage });

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


