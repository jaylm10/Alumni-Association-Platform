import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Send, Loader2, Search, ArrowLeft } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // You may need to install this: npm install jwt-decode

import './MessagesPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { conversationId } = useParams(); // To handle opening a specific chat from a URL
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // 1. Get the current user's ID from the token
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
        // If a conversationId is in the URL, select it
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

  // 4. Scroll to the bottom of the chat window when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Helper to find the other participant in a conversation
  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== currentUser?.id);
  };
  
  const selectedConversation = conversations.find(c => c._id === selectedConversationId);

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
                        <span className="conversation-preview">{/* Last message would go here */}</span>
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
                <div className="message-input-container">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button className="send-button">
                    <Send size={20} />
                  </button>
                </div>
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
