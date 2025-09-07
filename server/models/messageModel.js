const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  /**
   * A reference to the parent Conversation. This is crucial for linking a message
   * back to the chat it belongs to.
   */
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },

  /**
   * The ID of the user who sent the message.
   */
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'register', // Must match your user model name
    required: true,
  },

  /**
   * The actual text content of the message.
   */
  message: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // 'createdAt' will be used to display when the message was sent.
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
