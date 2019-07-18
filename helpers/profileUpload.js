const multer = require('multer');
const path = require('path');
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/profilepic/' + req.user.id + '/');
    },
    filename: (req, file, callback) => {
        callback(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});
// Initialise Upload
const profilepic = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, callback) => {
        checkFileType(file, callback);
    }
}).single('posterProfile'); // Must be the name as the HTML file upload input
// Check File Type
function checkFileType(file, callback) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Test extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Test mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback({ message: 'Images Only' });
    }
}
module.exports = profilepic; 