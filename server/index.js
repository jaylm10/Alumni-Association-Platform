const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes')
const jobRoutes = require('./routes/jobRoutes')
const profileRoutes = require('./routes/profileRoutes');
const path = require('path');
const app = express();
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    maxPoolSize: 10 // Maximum number of connections
}).then(()=>{
    console.log("Connected to MongoDB");
    // mongoose.set('debug',true)
}).catch((err)=>{
    console.error("MongoDB connection error:", err);
});

app.use("/api",authRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/profile", profileRoutes);



app.listen(process.env.PORT,()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})