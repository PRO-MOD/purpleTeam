const express = require('express');
const router = express.Router();

const Report = require('../../models/Report/Report');


// GET report details by ID
router.get('/details/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST route to add a new report
router.post('/create', async (req, res) => {
    try {
        const { name, description, deadline } = req.body;

        // Create a new report instance
        const newReport = new Report({
            name,
            description,
            deadline
        });

        // Save the report to the database
        const savedReport = await newReport.save();

        // Return the saved report
        res.status(201).json(savedReport);
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Failed to create report' });
    }
});

// Get all reports
router.get('/', async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// delete the given reports template
router.delete('/deleteReport', async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ error: 'Invalid input. Please provide an array of IDs.' });
    }

    try {
        const response = await Report.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: `${response.deletedCount} deleted succesfully` })
    } catch (error) {
        console.error('Error deleting challenges:', error);
        res.status(500).json({ error: 'Failed to delete challenges', message: error.message });
    }
})

// PUT endpoint to update a report
router.put('/edit/:id', async (req, res) => {
    const reportId = req.params.id;
    const { name, description, deadline, index } = req.body;

    try {
        // Find the report by ID and update it
        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { name, description, deadline, index },
            { new: true, runValidators: true }
        );

        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Respond with the updated report
        res.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Failed to update report' });
    }
});

module.exports = router;