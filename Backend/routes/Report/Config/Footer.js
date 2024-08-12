const express = require('express');
const router = express.Router();
const Footer = require('../../../models/Report/Footer');
const createUploadMiddleware = require('../../../utils/CTFdChallenges/multerConfig');
const path = require('path');
const fs = require('fs');

// Define the upload path for footers
const uploadPath = path.join(__dirname, '../../../uploads/footers');
const upload = createUploadMiddleware(uploadPath);

// Upload Footer Image
router.post('/upload', upload.single('footerImage'), async (req, res) => {
    try {
        const footer = new Footer({
            imageUrl: req.file.uniqueFilename,
        });
        await footer.save();
        res.status(201).json(footer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload footer image' });
    }
});

// Get All Footers
router.get('/', async (req, res) => {
    try {
        const footers = await Footer.find();
        res.status(200).json(footers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch footers' });
    }
});

// Get Footer by ID
router.get('/:id', async (req, res) => {
    try {
        const footer = await Footer.findById(req.params.id);
        if (!footer) {
            return res.status(404).json({ error: 'Footer not found' });
        }
        res.status(200).json(footer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch footer' });
    }
});

// Update Footer by ID
router.put('/:id', async (req, res) => {
    try {
        const footer = await Footer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!footer) {
            return res.status(404).json({ error: 'Footer not found' });
        }
        res.status(200).json(footer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update footer' });
    }
});

// Delete Footer by ID
router.delete('/:id', async (req, res) => {
    try {
        const footer = await Footer.findByIdAndDelete(req.params.id);
        if (!footer) {
            return res.status(404).json({ error: 'Footer not found' });
        }

        // Remove the image file from the server
        const filePath = path.join(uploadPath, footer.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(200).json({ message: 'Footer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete footer' });
    }
});

module.exports = router;
