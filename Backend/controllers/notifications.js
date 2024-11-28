const Notification = require('../models/Notification'); // Import Notification model
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// const fetchuser = require('../middleware/fetchuser'); 
/**
 * Handle notification-related socket events.
 * 
 * @param {Object} socket - The connected socket instance.
 * @param {Object} io - The Socket.IO instance.
 * @param {Array} users - The active users array.
 */
const handleNotifications = (socket, io, users) => {
  // Broadcast notifications to all users
  socket.on('sendNotification', async ({ title, message, type, token }) => {
    try {
      // Verify user using the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // If user is authenticated, decoded will contain the user information
      if (decoded && decoded.user && decoded.user.id) {
        const userId = decoded.user.id; // Get user id from decoded token

        // Find user by ID
        const user = await User.findById(userId);

        
        if (user && user.role === 'WT') {
          // Save the notification in the database
          const newNotification = new Notification({
            title,
            message,
            type,
          });
          await newNotification.save();

          // Broadcast the notification to all connected clients
          io.emit('receiveNotification', {
            title,
            message,
            type,
          });

          // console.log(`Notification sent by admin: ${user.name}`); // Log the admin who sent the notification
        } else {
          // If user is not an admin, send an error message
          socket.emit('error', 'Only admins can send notifications.');
        }
      } else {
        socket.emit('error', 'Invalid token or user.');
      }
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      socket.emit('error', 'Failed to send notification. Please try again.');
    }
  });
};

const getAllNotifications = async () => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });;
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  };
  
  module.exports = {
    handleNotifications,
    getAllNotifications, // Export additional functions as needed
  };