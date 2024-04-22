const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Message = require('../models/Message');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const uploadImageToCloudinary = require('../utils/imageUpload');

// Function to handle socket logic
let users = []
const handleSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected', socket.id);

        socket.on('addUser', (userId) => {
            const isUserExist = users.find((user) => user.userId === userId);
            if (!isUserExist) {
                const user = { userId, socketId: socket.id };
                users.push(user);
                io.emit('getUsers', users);
            }
        });

        // Define the 'sendMessage' event handler
        socket.on('sendMessage', ({ senderId, recipient, content, images }) => {
            const receiver = users.find((user) => user.userId == recipient);
            const sender = users.find((user) => user.userId == senderId);
            try {
                if (receiver) {
                    io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                        sender: senderId,
                        content,
                        recipient,
                        images,
                    });
                } else {
                    io.to(sender.socketId).emit('getMessage', {
                        sender: senderId,
                        content,
                        recipient,
                        images,
                    });
                }
            } catch (error) {
                console.error('Error handling sendMessage event:', error);
            }
        });

        socket.on('disconnect', () => {
            users = users.filter((user) => user.socketId !== socket.id);
            io.emit('getUsers', users);
        });
    });

    // Handle errors from Socket.IO
    io.on('error', (error) => {
        console.error('Socket.IO Error:', error);
    });
};



// Multer storage and upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Send message
router.post('/send-message', fetchuser, upload.array('images', 5), async (req, res) => {
    const sender = req.user.id;
    const { recipient, content } = req.body; // Extract recipient and content from the request body
    const images = req.files; // Extract images from the request files

    try {
        // Upload photos to Cloudinary and get their URLs
        const photoUrls = [];
        for (const photo of images) {
            const imageUrl = await uploadImageToCloudinary(photo);
            photoUrls.push(imageUrl); // Push imageUrl into photoUrls array
        }

        // Create and save the message with image URLs
        const message = await Message.create({ sender, recipient, content, images: photoUrls });
        await message.save();

        // Return the message with status code 201 if everything is successful
        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        // Handle other errors
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
module.exports = { router, handleSocket };