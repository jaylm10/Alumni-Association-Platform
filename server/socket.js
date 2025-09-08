// This file will manage real-time connections and messages
const onlineUsers = new Map();

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Event for a user to join and announce their presence
    socket.on("join", (userId) => {
      console.log(`User ${userId} joined with socket ${socket.id}`);
      onlineUsers.set(userId, socket.id); // Map userId to their socket.id
      // Optional: Broadcast online users list to all clients
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });

    // Event to listen for a new message from a client
    socket.on("sendMessage", ({ senderId, receiverId, conversationId, message }) => {
        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
            // If the receiver is online, send the message directly to them
            io.to(receiverSocketId).emit("newMessage", {
                senderId,
                conversationId,
                message,
                createdAt: new Date(), // Send a timestamp
            });
        }
        // Whether the user is online or not, the message is saved to DB
        // by the controller. This is just for real-time delivery.
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Find and remove the user from the online list
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = initializeSocket;
