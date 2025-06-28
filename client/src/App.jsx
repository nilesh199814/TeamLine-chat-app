// client/src/App.jsx
import { useState } from 'react';
import ChatRoom from './components/ChatRoom';

function App() {
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (room.trim()) {
      setJoined(true);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      {!joined ? (
        <div>
          <h2>Join a Room</h2>
          <input
            type="text"
            placeholder="Room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={handleJoin} style={{ marginLeft: '10px' }}>
            Join
          </button>
        </div>
      ) : (
        <ChatRoom room={room} />
      )}
    </div>
  );
}

export default App;
