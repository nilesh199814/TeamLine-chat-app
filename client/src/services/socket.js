// services/socket.js
import { io } from 'socket.io-client';

export const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

const socket = io(SOCKET_SERVER_URL, {
  transports: ['websocket'],
  autoConnect: false, // good for auth-based apps
});

export default socket;
