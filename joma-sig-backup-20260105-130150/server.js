const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Sessions collaboratives
const sessions = new Map();

io.on('connection', (socket) => {
  console.log('Nouvelle connexion:', socket.id);
  
  socket.on('join-session', (data) => {
    const { sessionId, user } = data;
    
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        users: new Map(),
        mapState: null
      });
    }
    
    const session = sessions.get(sessionId);
    session.users.set(socket.id, user);
    
    socket.join(sessionId);
    socket.emit('session-joined', { 
      sessionId, 
      users: Array.from(session.users.values()) 
    });
    
    socket.to(sessionId).emit('user-joined', user);
  });
  
  socket.on('map-update', (data) => {
    socket.to(data.sessionId).emit('map-update', {
      ...data,
      userId: socket.id
    });
  });
  
  socket.on('disconnect', () => {
    sessions.forEach((session, sessionId) => {
      if (session.users.has(socket.id)) {
        const user = session.users.get(socket.id);
        session.users.delete(socket.id);
        
        socket.to(sessionId).emit('user-left', user.id);
        
        if (session.users.size === 0) {
          sessions.delete(sessionId);
        }
      }
    });
  });
});

server.listen(3001, () => {
  console.log('✅ Serveur collaboratif sur port 3001');
});