// ChatRoom.jsx
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

function ChatRoom({ room }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState('');
  const socketRef = useRef(null); // ✅ persist socket

  useEffect(() => {
    const randomUser = `User${Math.floor(Math.random() * 1000)}`;
    setUser(randomUser);

    // ✅ Initialize socket only once
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket'], // ensure persistent connection
    });

    socketRef.current.on('connect', () => {
      console.log('Connected:', socketRef.current.id);
    });

    // ✅ Join room
    socketRef.current.emit('join_room', room);

    // ✅ Load history
    axios.get(`${SOCKET_SERVER_URL}/messages/${room}`).then((res) => {
      setChat(res.data);
    });

    // ✅ Listen for incoming messages
    socketRef.current.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });

    // ✅ Clean up on unmount
    return () => {
      socketRef.current.disconnect();
      console.log('Disconnected');
    };
  }, [room]); // ✅ only re-run when room changes

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { user, message, room };
      socketRef.current.emit('send_message', newMessage);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Room: {room}</h2>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {chat.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage} style={{ marginLeft: '10px' }}>
        Send
      </button>
    </div>
  );
}

export default ChatRoom;
