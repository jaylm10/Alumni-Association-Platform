import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Send, Loader2, Search, ArrowLeft } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client'; // <-- 1. IMPORT SOCKET.IO CLIENT

import './MessagesPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- 2. ESTABLISH THE SOCKET CONNECTION ---
// Define the socket outside the component to prevent it from re-connecting on every re-render.
const socket = io('http://localhost:3000'); // Your backend server URL

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { conversationId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // 1. Get current user from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setCurrentUser(decodedToken);
    } else {
      toast.error("You must be logged in to view messages.");
      navigate('/login');
    }
  }, [navigate]);

  // 2. Fetch all conversations for the logged-in user
  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:3000/api/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(data.conversations);
        if (conversationId) {
          setSelectedConversationId(conversationId);
        }
      } catch (error) {
        toast.error("Failed to load your conversations.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, [currentUser, conversationId]);

  // 3. Fetch messages for the selected conversation
  useEffect(() => {
    if (!selectedConversationId) return;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:3000/api/conversations/${selectedConversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(data.messages);
      } catch (error) {
        toast.error("Failed to load messages for this conversation.");
      } finally {
        setIsLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [selectedConversationId]);

  // --- 4. SET UP REAL-TIME LISTENERS & JOIN SOCKET ROOM ---
  useEffect(() => {
    if (!currentUser) return;
    
    // Announce the user's presence to the server
    socket.emit('join', currentUser.id);

    // Listener for incoming messages
    const messageListener = (incomingMessage) => {
      // Check if the message belongs to the currently open conversation
      if (incomingMessage.conversationId === selectedConversationId) {
        // Create a message object that matches the structure from the database for consistency
        const formattedMessage = { ...incomingMessage, senderId: { _id: incomingMessage.senderId } };
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      } else {
        toast.info(`You have a new message!`);
        // Optional: you could refetch conversations here to show a notification dot
      }
    };

    socket.on('newMessage', messageListener);

    // Clean up the listener when the component unmounts or the selected chat changes
    // This is crucial to prevent duplicate listeners.
    return () => {
      socket.off('newMessage', messageListener);
    };
  }, [currentUser, selectedConversationId]); // <-- Re-subscribe if the selected chat changes


  // 5. Scroll to the bottom of the chat window when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Helper to find the other participant in a conversation
  const getOtherParticipant = (conversation) => {
    if (!conversation) return null; // <-- Add safety check
    return conversation.participants.find(p => p._id !== currentUser?.id);
  };
  
  const selectedConversation = conversations.find(c => c._id === selectedConversationId);
  
  // --- 6. IMPLEMENT SEND MESSAGE FUNCTION ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedConversation) return;

    const token = localStorage.getItem('token');
    const otherUser = getOtherParticipant(selectedConversation);
    if (!otherUser) return; // Safety check

    const messagePayload = {
        message: newMessage,
        conversationId: selectedConversationId,
        senderId: currentUser.id,
        receiverId: otherUser._id
    };

    try {
        // a. Save message to the database via API for persistence
        const { data } = await axios.post('http://localhost:3000/api/conversations/messages', messagePayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // b. Add the new message to our own screen instantly for a snappy UI
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
        
        // c. Emit the message through the socket to the other user for real-time delivery
        socket.emit('sendMessage', messagePayload);
        
    } catch (error) {
        toast.error("Failed to send message.");
    }
  };


  return (
    <div className="messages-page-container">
      <Header />
      <main className="messages-main">
        <div className="messages-layout">
          
          {/* ----- LEFT PANEL: CONVERSATION LIST ----- */}
          <aside className={`messages-sidebar ${selectedConversationId ? 'mobile-hidden' : ''}`}>
            <div className="sidebar-header">
              <h2>Chats</h2>
              <div className="sidebar-search">
                <Search size={18} />
                <input type="text" placeholder="Search chats..." />
              </div>
            </div>
            <div className="conversation-list">
              {isLoading ? (
                <div className="loading-conversations"><Loader2 className="animate-spin" /></div>
              ) : (
                conversations.map(convo => {
                  const otherUser = getOtherParticipant(convo);
                  return (
                    <div
                      key={convo._id}
                      className={`conversation-item ${selectedConversationId === convo._id ? 'active' : ''}`}
                      onClick={() => setSelectedConversationId(convo._id)}
                    >
                      <img src={otherUser?.profilePictureUrl || 'https://via.placeholder.com/50'} alt={otherUser?.name} />
                      <div className="conversation-details">
                        <span className="conversation-name">{otherUser?.name}</span>
                        <span className="conversation-preview">{convo.lastMessage}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* ----- RIGHT PANEL: CHAT WINDOW ----- */}
          <section className={`chat-window ${!selectedConversationId ? 'mobile-hidden' : ''}`}>
            {selectedConversation ? (
              <>
                <div className="chat-header">
                  <button className="back-button" onClick={() => setSelectedConversationId(null)}>
                    <ArrowLeft size={20}/>
                  </button>
                  <img src={getOtherParticipant(selectedConversation)?.profilePictureUrl || 'https://via.placeholder.com/40'} alt={getOtherParticipant(selectedConversation)?.name} />
                  <h3>{getOtherParticipant(selectedConversation)?.name}</h3>
                </div>
                <div className="message-list">
                  {isLoadingMessages ? (
                    <div className="loading-messages"><Loader2 className="animate-spin" size={32} /></div>
                  ) : (
                    messages.map(msg => (
                      <div key={msg._id} className={`message ${msg.senderId._id === currentUser.id ? 'sent' : 'received'}`}>
                        <div className="message-bubble">
                          <p>{msg.message}</p>
                          <span className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {/* --- UPDATE THE FORM TO USE THE NEW FUNCTION --- */}
                <form className="message-input-container" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    autoComplete="off"
                  />
                  <button type="submit" className="send-button">
                    <Send size={20} />
                  </button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <h2>Select a chat to start messaging</h2>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;

