const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  /**
   * The 'participants' field is an array that holds the user IDs of everyone
   * in the chat. For a 1-on-1 chat, this array will always contain two user IDs.
   * We use 'ref' to link these IDs back to your main user model.
   */
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'register', // This MUST match the name of your user model
    required: true,
  }],

  /**
   * This 'messages' array stores references to all the individual Message documents
   * that belong to this conversation. Storing only references (ObjectIds) keeps
   * this document small and fast.
   */
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: [],
  }],
}, {
  // timestamps automatically add 'createdAt' and 'updatedAt' fields,
  // which are essential for sorting conversations by the most recent activity.
  timestamps: true,
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
