const express = require('express')
const router = express.Router()
const { getAllNotifications } = require('../controllers/notifications');
const Notification = require('../models/Notification')

router.get('/', async (req, res) => {
  try {
    const notifications = await getAllNotifications();
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Edit a specific notification
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // You can include other fields if necessary
  
    try {
      const updatedNotification = await Notification.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedNotification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      res.status(200).json({ notification: updatedNotification });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update notification' });
    }
  });
  
  // Delete a specific notification
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedNotification = await Notification.findByIdAndDelete(id);
      if (!deletedNotification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  });
  

module.exports = router