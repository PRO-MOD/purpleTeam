const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper function to ensure directories exist
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

// Function to create multer upload middleware with dynamic path
const createUploadMiddleware = (uploadPath) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            ensureDirectoryExistence(uploadPath);
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = path.extname(file.originalname);
            const uniqueFilename = file.originalname + '-' + uniqueSuffix + extension;
            file.uniqueFilename = uniqueFilename;
            cb(null, uniqueFilename);
        }
    });

    return multer({ storage: storage });
};

module.exports = createUploadMiddleware;
