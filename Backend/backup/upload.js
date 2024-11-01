// upload.js
const multer = require("multer"); // For uploading files
const path = require("path");
const generateCode = require("../utils/generateCode");

// Define storage configuration
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../uploads")); // Use path.join for cross-platform compatibility
  },
  filename: (req, file, callback) => {
    // Original_file_name_12_digit_random_number.ext
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    
    if (!ext) {
      return callback(new Error("File must have an extension."), null); // Handle missing extension
    }

    const filename = originalName.replace(ext, "");
    const compressedFilename = filename.split(" ").join("_");
    const lowercaseFilename = compressedFilename.toLowerCase();
    const code = generateCode(12);
    const finalFile = `${lowercaseFilename}_${code}${ext}`; 
    
    // Save the file with the final name in the uploads folder
    callback(null, finalFile);
  },
});

// Create multer upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: 1000 * 1024 * 1024, // Limit to 100MB 
  },
  fileFilter: (req, file, callback) => {
    const mimetype = file.mimetype;

    // Allow image and video MIME types
    const imageTypes = ["image/jpeg", "image/png", "image/gif"];
    const videoTypes = ["video/mp4", "video/x-m4v", "video/x-msvideo"];

    if (imageTypes.includes(mimetype) || videoTypes.includes(mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Only image and video files are allowed."));
    }
  }
});

module.exports = { upload };
