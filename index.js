// Simple Socket.io Chat Server
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Store connected users
let users = [];

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins
  socket.on('join', (username) => {
    users.push({ id: socket.id, username });
    io.emit('userJoined', { username, users });
    io.emit('messageList', messages);
  });

  // Receive message
  socket.on('sendMessage', (data) => {
    const message = {
      username: data.username,
      text: data.message,
      timestamp: new Date().toLocaleTimeString()
    };
    messages.push(message);
    io.emit('receiveMessage', message);
  });

  // User disconnects
  socket.on('disconnect', () => {
    const user = users.find(u => u.id === socket.id);
    if (user) {
      users = users.filter(u => u.id !== socket.id);
      io.emit('userLeft', { username: user.username, users });
    }
    console.log('User disconnected:', socket.id);
  });
});

let messages = [];
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
});
