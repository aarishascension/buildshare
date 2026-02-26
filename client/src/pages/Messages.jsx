import { useState, useEffect, useRef } from 'react';
import axios from '../config/axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import './Messages.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize Socket.io connection
  useEffect(() => {
    socketRef.current = io(API_URL, {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socketRef.current.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      fetchConversations(); // Update conversation list
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.conversationId);
      
      // Join the conversation room
      if (socketRef.current) {
        socketRef.current.emit('join-conversation', selectedConversation.conversationId);
      }

      return () => {
        // Leave the conversation room when switching conversations
        if (socketRef.current) {
          socketRef.current.emit('leave-conversation', selectedConversation.conversationId);
        }
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('/api/messages/conversations');
      setConversations(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const { data } = await axios.get(`/api/messages/${conversationId}`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await axios.post('/api/messages', {
        recipientId: selectedConversation.otherUser._id,
        content: newMessage
      });
      setNewMessage('');
      fetchMessages(selectedConversation.conversationId);
      fetchConversations();
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="container">Loading messages...</div>;

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <h2>Messages</h2>
        <div className="conversations-list">
          {conversations.length === 0 ? (
            <p className="empty-state">No conversations yet</p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.conversationId}
                className={`conversation-item ${selectedConversation?.conversationId === conv.conversationId ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="conversation-avatar">
                  {conv.otherUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h4>{conv.otherUser.name}</h4>
                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">{conv.unreadCount}</span>
                    )}
                  </div>
                  <p className="conversation-preview">{conv.lastMessage}</p>
                  <span className="conversation-time">{formatTime(conv.lastMessageTime)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="messages-main">
        {selectedConversation ? (
          <>
            <div className="messages-header">
              <div className="conversation-avatar">
                {selectedConversation.otherUser.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3>{selectedConversation.otherUser.name}</h3>
                <p className="user-title">{selectedConversation.otherUser.title}</p>
              </div>
            </div>

            <div className="messages-list">
              {messages.map(msg => (
                <div
                  key={msg._id}
                  className={`message ${msg.sender._id === user.id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p>{msg.content}</p>
                    <span className="message-time">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-input-form" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                autoFocus
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
