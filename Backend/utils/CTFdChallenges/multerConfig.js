// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Helper function to ensure directories exist
// const ensureDirectoryExistence = (filePath) => {
//     const dirname = path.dirname(filePath);
//     if (!fs.existsSync(dirname)) {
//         fs.mkdirSync(dirname, { recursive: true });
//     }
// };

// // Function to create multer upload middleware with dynamic path
// const createUploadMiddleware = (uploadPath) => {
//     const storage = multer.diskStorage({
//         destination: function (req, file, cb) {
//             ensureDirectoryExistence(uploadPath);
//             cb(null, uploadPath);
//         },
//         filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//             const extension = path.extname(file.originalname);
//             const uniqueFilename = file.originalname + '-' + uniqueSuffix + extension;
//             file.uniqueFilename = uniqueFilename;
//             cb(null, uniqueFilename);
//         }
//     });

//     return multer({ storage: storage });
// };

// module.exports = createUploadMiddleware;


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
        },
    });

    // File filter to allow only PNG, JPEG, and JPG files
    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Only .png, .jpeg, and .jpg formats are allowed!'), false); // Reject the file
        }
    };

    return multer({ 
        storage: storage, 
        fileFilter: fileFilter 
    });
};

module.exports = createUploadMiddleware;
