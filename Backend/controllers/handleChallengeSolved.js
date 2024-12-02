/**
 * Handle challenge-solved-related socket events.
 * 
 * @param {Object} socket - The connected socket instance.
 * @param {Object} io - The Socket.IO instance.
 * @param {Array} users - The active users array.
 */
const handleChallengeSolved = (socket, io, users) => {
  // Listen for challenge-solved event
  socket.on('challengeSolved', async () => {
    console.log("challengeSolved");
    
    try {
      // Generate a generic notification
      const data = {
        message: "refresh"
      };

      // Broadcast the notification to all connected clients
      io.emit('challengeSolvedNotification', data);

      // Log the event
    //   console.log('A challenge was solved. Notification broadcasted.');
    } catch (error) {
      console.error('Error broadcasting challenge solved notification:', error);
      socket.emit('error', 'Failed to process challengeSolved event. Please try again.');
    }
  });
};

module.exports = {
  handleChallengeSolved,
};
