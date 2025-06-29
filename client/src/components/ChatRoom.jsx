import { useEffect, useState } from 'react';
import axios from 'axios';
import socket, {SOCKET_SERVER_URL} from '../services/socket'; // ✅ shared socket instance

function ChatRoom({ room }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState('');

  useEffect(() => {
    const randomUser = `User${Math.floor(Math.random() * 1000)}`;
    setUser(randomUser);

    // ✅ Connect and join room
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join_room', room);

    // ✅ Load message history
    axios.get(`${SOCKET_SERVER_URL}/messages/${room}`).then((res) => {
      setChat(res.data);
    });

    // ✅ Listen for incoming messages
    const handleMessage = (data) => {
      setChat((prev) => [...prev, data]);
    };

    socket.on('receive_message', handleMessage);

    // ✅ Cleanup
    return () => {
      socket.off('receive_message', handleMessage);
      socket.disconnect(); // or `socket.leave(room)` if you manage rooms
      console.log('Socket disconnected');
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { user, message, room };
      socket.emit('send_message', newMessage);
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
