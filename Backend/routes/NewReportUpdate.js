const express = require('express');
const router = express.Router();
const NewReportUpdate = require('../models/NewReportUpdate'); // Adjust the path as per your project structure

router.get('/newReports', async (req, res) => {
    try {
        // Find records where clickCount is 0
        const newReports = await NewReportUpdate.find({ clickCount: 0 }).populate('userId', 'name');

        // Send the data in JSON format
        res.json(newReports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT route to update click count for a report
router.put('/newReports/:updateId', async (req, res) => {
    const { updateId } = req.params;

    try {
        // Find the report by its ID
        const report = await NewReportUpdate.findById(updateId);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }

        // Increment the click count by 1
        report.clickCount += 1;
        await report.save();

        // Respond with success message
        res.json({ message: 'Click count updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
