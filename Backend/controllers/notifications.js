const Notification = require('../models/Notification'); // Import Notification model

/**
 * Handle notification-related socket events.
 * 
 * @param {Object} socket - The connected socket instance.
 * @param {Object} io - The Socket.IO instance.
 * @param {Array} users - The active users array.
 */
const handleNotifications = (socket, io, users) => {
  // Broadcast notifications to all users
  socket.on('sendNotification', async ({ title, message, type }) => {
    try {
      
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
    } catch (error) {
      console.error('Error broadcasting notification:', error);
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