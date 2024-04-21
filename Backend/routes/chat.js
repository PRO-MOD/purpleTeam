const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');

// Send message
router.post('/send-message', fetchuser, async (req, res) => {
    const sender = req.user.id;
    const { recipient, content } = req.body;
    try {
        const message = await Message.create({ sender, recipient, content });
        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get messages between two users
router.get('/messages/:recipient', fetchuser, async (req, res) => {
    const userId = req.user.id;
    const { recipient } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: recipient },
                { sender: recipient, recipient: userId }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get conversations involving the logged-in user
router.get('/conversations', fetchuser, async (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in the request object after authentication
    try {
        const conversations = await Message.aggregate([
            // Match messages involving the logged-in user
            { $match: { $or: [{ sender: new mongoose.Types.ObjectId(userId) }, { recipient: new mongoose.Types.ObjectId(userId) }] } },
            // Sort messages by timestamp in descending order
            { $sort: { timestamp: -1 } },
            // Group messages by sender and recipient
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
                            { sender: "$sender", recipient: "$recipient" },
                            { sender: "$recipient", recipient: "$sender" }
                        ]
                    },
                    latestMessage: { $first: "$$ROOT" } // Store the entire message document for the latest message
                }
            },
            // Project fields for the conversation list
            {
                $project: {
                    _id: 0,
                    sender: "$_id.sender",
                    recipient: "$_id.recipient",
                    latestMessage: 1
                }
            }
        ]);

        // Prepare response data
        const formattedConversations = await Promise.all(conversations.map(async conversation => {
            const senderName = await User.findById(conversation.sender).select('name');
            const recipientName = await User.findById(conversation.recipient).select('name');
            const latestMessageContent = conversation.latestMessage.content;
            return {
                sender: senderName,
                recipient: recipientName,
                latestMessageDate: conversation.latestMessage.timestamp,
                latestMessageContent: latestMessageContent
            };
        }));

        res.json(formattedConversations);
    } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;