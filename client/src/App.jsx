// client/src/App.jsx
import { useState } from 'react';
import ChatRoom from './components/ChatRoom';
import './App.css'; // Import the CSS file

function App() {
  const [room, setRoom] = useState('');
  const [userId, setUserId] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (room.trim()) {
      setJoined(true);
    }
  };

  return (
    <div className="app-container">
      {!joined ? (
        <div className="join-box">
          <h2 className="heading">Join a Chat Room</h2>

          <input
            className="input-field"
            type="text"
            placeholder="Room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <input
            className="input-field"
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <button className="join-button" onClick={handleJoin}>
            Join Room
          </button>
        </div>
      ) : (
        <ChatRoom room={room} userId={userId} />
      )}
    </div>
  );
}

export default App;
