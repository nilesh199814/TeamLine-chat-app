// client/src/components/ChatRoom.jsx
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import socket, { SOCKET_SERVER_URL } from '../services/socket';
import './ChatRoom.css';

function ChatRoom({ room, userId }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join_room', room);

    axios.get(`${SOCKET_SERVER_URL}/messages/${room}`).then((res) => {
      setChat(res.data);
    });

    const handleMessage = (data) => {
      setChat((prev) => [...prev, data]);
    };

    socket.on('receive_message', handleMessage);

    return () => {
      socket.off('receive_message', handleMessage);
      socket.disconnect();
    };
  }, [room, userId]);

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [chat]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { user: userId, message, room };
      socket.emit('send_message', newMessage);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-heading">Room: {room}</h2>

      <div className="chat-box" ref={chatBoxRef}>
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.user === userId ? 'own-message' : ''}`}
          >
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          placeholder="Type your message..."
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
