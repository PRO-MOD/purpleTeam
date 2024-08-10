const express = require('express');
const ReportConfig = require('../../../models/Report/ReportConfig');

const router = express.Router();

// Create or Update Report Configuration
router.post('/:reportId', async (req, res) => {
    try {
        const { headerId, footerId, firstPage, lastPage, enablePageNumber } = req.body;
        const reportConfig = await ReportConfig.findOneAndUpdate(
            { report: req.params.reportId },
            {
                report: req.params.reportId,
                header: headerId,
                footer: footerId,
                firstPage,
                lastPage,
                enablePageNumber
            },
            { new: true, upsert: true }
        );

        res.status(200).json(reportConfig);
    } catch (error) {
        res.status(500).json({ message: 'Error creating or updating report configuration', error });
    }
});

// Get a specific Report Configuration
router.get('/:reportId', async (req, res) => {
    try {
        const reportConfig = await ReportConfig.findOne({ report: req.params.reportId })
            .populate('header')
            .populate('footer');

        if (!reportConfig) {
            return res.status(404).json({ message: 'Report configuration not found' });
        }

        res.status(200).json(reportConfig);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report configuration', error });
    }
});

// Delete a Report Configuration
router.delete('/:reportId', async (req, res) => {
    try {
        const reportConfig = await ReportConfig.findOneAndDelete({ report: req.params.reportId });

        if (!reportConfig) {
            return res.status(404).json({ message: 'Report configuration not found' });
        }

        res.status(200).json({ message: 'Report configuration deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting report configuration', error });
    }
});

module.exports = router;
