const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Message = require('../models/Message');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const uploadImageToCloudinary = require('../utils/imageUpload');
const notificationSound = './notification.mp3';

// Function to handle socket logic
let users = []
// let isUserIdAvailable = false;
const handleSocket = (io) => {
    io.on('connection', (socket) => {
        
        socket.on('addUser', (userId) => {
            console.log('user connected', socket.id);
            console.log('userId: >>'+userId);
            if (userId) {
                // console.log("hello");
                // Add the user to the active users list only if userId is available
                const isUserExist = users.find((user) => user.userId === userId);
                if (!isUserExist) {
                    // console.log("hello1");
                    const newUser = { userId, socketId: socket.id };
                    users.push(newUser);
                    io.emit('getUsers', users);
                }
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
        let messages = await Message.find({
            $or: [
                { sender: userId, recipient: recipient },
                { sender: recipient, recipient: userId }
            ]
        }).sort({ timestamp: 1 });

        // Mark messages as read and update readCount
        messages = await Promise.all(messages.map(async (message) => {
            // Check if the message is sent by the other user and has not been read yet
            if (message.recipient.toString() === userId && message.readCount <= 2) {
                // Increment read count
                message.readCount += 1;
                // Save the message
                await message.save();
            }
            return message;
        }));

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
            const senderName = await User.findById(conversation.sender).select('name profile');
            const recipientName = await User.findById(conversation.recipient).select('name profile');
            const latestMessageContent = conversation.latestMessage.content;

            // Handle case where sender or recipient could not be found
            if (!senderName || !recipientName) {
                return null; // Skip conversation if either sender or recipient is missing
            }

            return {
                sender: senderName,
                recipient: recipientName,
                latestMessageDate: conversation.latestMessage.timestamp,
                latestMessageContent: latestMessageContent
            };
        }));

        // Filter out any null conversations (in case a user was not found)
        const cleanedConversations = formattedConversations.filter(conversation => conversation !== null);

        res.json(cleanedConversations);
    } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/conversations1', fetchuser, async (req, res) => {
    const userId = req.user.id; // Assuming user ID is available in the request object after authentication
    try {
        // Fetch messages involving the logged-in user
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { recipient: userId }
            ]
        }).sort({ timestamp: -1 });

        // Group messages by sender and recipient
        const conversationsMap = {};
        messages.forEach(message => {
            const otherUser = message.sender.toString() === userId ? message.recipient : message.sender;
            if (!conversationsMap[otherUser]) {
                conversationsMap[otherUser] = {
                    otherUserId: otherUser,
                    latestMessage: message,
                    unreadCount: 0 // Initialize unread count to 0
                };
            }
            if (message.recipient.toString() === userId && message.readCount < 2) {
                conversationsMap[otherUser].unreadCount++; // Increment unread count if the message is unread
            }
        });

        // Convert map to array of conversations
        const conversations = Object.values(conversationsMap);

        // Prepare response data
        const formattedConversations = await Promise.all(conversations.map(async conversation => {
            const otherUserDetails = await User.findById(conversation.otherUserId).select('name profile');
            const latestMessageContent = conversation.latestMessage.content;
            const senderName = await User.findById(conversation.latestMessage.sender).select('name profile');
            const recipientName = await User.findById(conversation.latestMessage.recipient).select('name profile');
            return {
                sender: senderName,
                recipient: recipientName,
                otherUser: otherUserDetails,
                latestMessageDate: conversation.latestMessage.timestamp,
                latestMessageContent: latestMessageContent,
                unreadCount: conversation.unreadCount // Include unread count in the response
            };
        }));

        res.json(formattedConversations);
    } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/unread-messages', fetchuser, async (req, res) => {
    try {
        // Get the user ID of the logged-in user from the request (assuming it's stored in req.user)
        const userId = req.user.id;

        // Fetch all messages where the user is either the sender or the recipient
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { recipient: userId }
            ]
        });

        // Calculate the total unread messages count
        let unreadMessagesCount = 0;
        messages.forEach(message => {
            // Check if the user is a recipient of the message and the message is unread
            if (message.recipient.equals(userId) && message.readCount <= 1) {
                unreadMessagesCount++;
            }
        });

        res.status(200).json({ unreadMessagesCount });
    } catch (error) {
        console.error('Error fetching unread messages count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/unread-messages-users', fetchuser, async (req, res) => {
    try {
        // Get the user ID of the logged-in user from the request (assuming it's stored in req.user)
        const userId = req.user.id;

        // Fetch all messages where the user is either the sender or the recipient
        const messages = await Message.find({
            $or: [
                { sender: userId },
                { recipient: userId }
            ]
        });

        // Create an object to store unread messages count for each user
        const unreadMessagesByUser = {};

        // Calculate the unread messages count for each user
        messages.forEach(message => {
            // Check if the user is a recipient of the message and the message is unread
            if (message.recipient.equals(userId) && message.readCount < 1) {
                // Increment the unread messages count for the sender
                if (!unreadMessagesByUser[message.sender]) {
                    unreadMessagesByUser[message.sender] = 0;
                }
                unreadMessagesByUser[message.sender]++;
            }
        });

        res.status(200).json({ unreadMessagesByUser });
    } catch (error) {
        console.error('Error fetching unread messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = { router};