const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 150 * 1024 * 1024 // 510MB
    }
});

module.exports = {upload};