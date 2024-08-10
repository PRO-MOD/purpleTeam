// routes/headerRoutes.js
const express = require('express');
const router = express.Router();
const Header = require('../../../models/Report/Header');
const createUploadMiddleware = require('../../../utils/CTFdChallenges/multerConfig');
const path = require('path');
const fs = require('fs');

// Define the upload path for headers
const uploadPath = path.join(__dirname, '../../../uploads/headers');
const upload = createUploadMiddleware(uploadPath);

// Upload Header Image
router.post('/upload', upload.single('headerImage'), async (req, res) => {
    try {
        const header = new Header({
            imageUrl: req.file.uniqueFilename,
        });
        await header.save();
        res.status(201).json(header);
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload header image' });
    }
});

// Get All Headers
router.get('/', async (req, res) => {
    try {
        const headers = await Header.find();
        res.status(200).json(headers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch headers' });
    }
});

// Get Header by ID
router.get('/:id', async (req, res) => {
    try {
        const header = await Header.findById(req.params.id);
        if (!header) {
            return res.status(404).json({ error: 'Header not found' });
        }
        res.status(200).json(header);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch header' });
    }
});

// Update Header by ID
router.put('/:id', async (req, res) => {
    try {
        const header = await Header.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!header) {
            return res.status(404).json({ error: 'Header not found' });
        }
        res.status(200).json(header);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update header' });
    }
});

// Delete Header by ID
router.delete('/:id', async (req, res) => {
    try {
        const header = await Header.findByIdAndDelete(req.params.id);
        if (!header) {
            return res.status(404).json({ error: 'Header not found' });
        }

        // Remove the image file from the server
        const filePath = path.join(uploadPath, header.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(200).json({ message: 'Header deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete header' });
    }
});

module.exports = router;
