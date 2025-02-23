import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const MessagingPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch users list
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/users", { withCredentials: true })
      .then((response) => setUsers([...response.data]))
      .catch((error) => console.error(error));
  }, []);

  // Fetch messages (only passing selectedUser ID, backend extracts current user from token)
  useEffect(() => {
    if (selectedUser) {
      axios
        .get(`http://localhost:5001/api/messages/${selectedUser._id}`, {
          withCredentials: true, // To send cookies (token) for user authentication
        })
        .then((response) => setMessages(response.data))
        .catch((error) => console.error(error));
    }
  }, [selectedUser]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedUser) return;

    try {
      await axios.post(
        "http://localhost:5001/api/messages",
        {
          receiver_id: selectedUser._id, // Only send receiver ID
          message: newMessage,
        },
        {
          withCredentials: true, // Includes cookies (JWT token)
          headers: { "Content-Type": "application/json" },
        }
      );
      setNewMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="messaging-page">
      <div className="sidebar">
        <h3>Messages</h3>
        <div className="user-list">
          {users.map((user) => (
            <div
              key={user._id}
              className={`user-item ${
                selectedUser?._id === user._id ? "active" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <img
                src={user.profile_picture}
                alt={user.username}
                className="avatar"
              />
              <span>{user.username}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chat">
        {selectedUser ? (
          <div className="chat-container">
            <div className="chat-header">
              <img
                src={selectedUser.profile_picture}
                alt={selectedUser.username}
                className="avatar"
              />
              <h4>{selectedUser.username}</h4>
            </div>
            <div className="messages">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.sender_id === selectedUser._id
                        ? "sent"
                        : "received"
                    }`}
                  >
                    <div className="message-content">
                      <p>{message.message}</p>
                      <span className="timestamp">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>

            <div className="message-input">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
              ></textarea>
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div className="no-conversation">
            <h4>Select a user to start messaging</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
