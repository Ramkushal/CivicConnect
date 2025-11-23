const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const officerRoutes = require('./routes/officerRoutes');
const issueRoutes = require('./routes/issueRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const resolutionRoutes = require('./routes/resolutionRoutes');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for now, restrict in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/officers', officerRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/resolutions', resolutionRoutes);

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health Check
app.get('/', async (req, res) => {
  try {
    // Try to connect to DB
    await require('./prisma/client').$queryRaw`SELECT 1`;
    res.json({ message: 'CivicConnect API is running', db: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ message: 'API running but DB failed', error: error.message });
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, server };
