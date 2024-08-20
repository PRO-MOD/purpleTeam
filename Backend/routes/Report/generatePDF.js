const Report = require('../../models/Report/Report');
const Question = require('../../models/Report/Question');
const UserResponse = require('../../models/Report/UserResponse');
const ReportConfig = require('../../models/Report/ReportConfig');

const PDFUtils = require('../../utils/Report/generatePdf');
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();


async function generateReportPDF(reportId, userId, userResponseId, outputFilePath) {
    try {
        // Fetch the report information
        const report = await Report.findById(reportId);
        if (!report) throw new Error('Report not found');

        // Fetch the questions for the report
        const questions = await Question.find({ report: reportId }).sort({ index: 1 });

        // Fetch the user's responses for the report
        const userResponse = await UserResponse.findOne({ reportId, userId, _id: userResponseId }).populate('responses.questionId');
        if (!userResponse) throw new Error('User responses not found');

        const reportConfig = await ReportConfig.findOne({ report: reportId })
            .populate('header')
            .populate('footer');
        if (!reportConfig) throw new Error('Report configuration not found');

        // Define the header and footer images
        const headerImagePath = reportConfig.header ? path.join(__dirname, `../../uploads/headers/${reportConfig.header.imageUrl}`) : null;
        const footerImagePath = reportConfig.footer ? path.join(__dirname, `../../uploads/footers/${reportConfig.footer.imageUrl}`) : null;
        const firstPageConfig = reportConfig.firstPage || [];
        const lastPageConfig = reportConfig.lastPage || [];
        const enablePageNumber = reportConfig.enablePageNumber;

        // Generate the PDF using the utility function
        await PDFUtils.generatePDF(questions, userResponse, outputFilePath, headerImagePath, footerImagePath, firstPageConfig, lastPageConfig, enablePageNumber);
        // console.log(`PDF saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}


// Route to generate PDF report
router.get('/generateReport/:reportId/:userId/:userResponseId', async (req, res) => {
    const { reportId, userId, userResponseId } = req.params;

    // Define the output file path
    const outputFilePath = path.join(__dirname, '../../uploads', `Report/report_${reportId}_${userId}_${userResponseId}.pdf`);

    try {
        // Check if the PDF already exists
        if (fs.existsSync(outputFilePath)) {
            // If the PDF exists, return the file name to the user
            res.json({ fileName: `report_${reportId}_${userId}_${userResponseId}.pdf`, status: 'exists' });
        } else {
            // If the PDF does not exist, generate the PDF using the updated generateReportPDF function
            await generateReportPDF(reportId, userId, userResponseId, outputFilePath);

            // Send the file name back to the client
            res.json({ fileName: `report_${reportId}_${userId}_${userResponseId}.pdf`, status: 'generated' });
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;