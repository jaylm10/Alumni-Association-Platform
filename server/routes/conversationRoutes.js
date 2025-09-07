const express = require('express');
const router = express.Router();
const {
  startConversation,
  getConversations,
  getMessagesForConversation
} = require('../controller/conversationController');
const authMiddleware = require('../middleware/auth');

// All routes in this file are protected and require a valid token.
router.use(authMiddleware);

// Route to start/find a conversation with another user
router.post('/start', startConversation);

// Route to get all of the current user's conversations
router.get('/', getConversations);

// Route to get all messages for a specific conversation
router.get('/:id/messages', getMessagesForConversation);

module.exports = router;
