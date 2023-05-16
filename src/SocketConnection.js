import io from 'socket.io-client';

const socket = io('https://airhockey.onrender.com', {
    transports: ['websocket'],
    extraHeaders: {
      'Access-Control-Allow-Origin': 'http://localhost:5173' 
    }
  });

export default socket;