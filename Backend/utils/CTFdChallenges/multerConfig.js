const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads/CTFdChallenges');
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); // Destination folder for uploads
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const uniqueFilename = file.originalname + '-' + uniqueSuffix + extension;
        file.uniqueFilename = uniqueFilename; // Add unique filename to file object
        cb(null, uniqueFilename); // Unique filename
    }
});

const fileFilter = (req, file, cb) => {
    // Accept all file types for this example
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
