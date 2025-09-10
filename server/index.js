const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http'); // <-- 1. IMPORT NODE'S HTTP MODULE
const { Server } = require('socket.io'); // <-- 2. IMPORT THE Server CLASS
const initializeSocket = require('./socket'); // <-- 3. IMPORT THE SOCKET LOGIC YOU CREATED

// --- All your route imports remain the same ---
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const studentProfileRoutes = require('./routes/studentProfileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const eventRoutes = require('./routes/eventRoutes');


const app = express();
dotenv.config();

// --- 4. CREATE AN HTTP SERVER & ATTACH SOCKET.IO ---
const server = http.createServer(app); // Create an HTTP server with your Express app as the handler
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // IMPORTANT: Your React app's URL
    methods: ["GET", "POST"]
  }
});

// --- 5. INITIALIZE YOUR SOCKET LOGIC ---
// This passes the 'io' instance to your socket.js file
initializeSocket(io);


// --- All your middleware remains the same ---
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase JSON limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Increase URL-encoded limit
app.use(express.static('public')); // Serve static files like images


// MongoDB Connection
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// --- All your API routes remain the same ---
app.use("/api", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/student-profile", studentProfileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/conversations", conversationRoutes);
app.use('/api/events', eventRoutes);


// --- 6. UPDATE HOW THE SERVER STARTS ---
const PORT = process.env.PORT || 3000;
// Use 'server.listen' instead of 'app.listen' to start both HTTP and WebSocket servers
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

