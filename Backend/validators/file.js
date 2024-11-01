const validateExtension = (ext) => {
    const lowerExt = ext.toLowerCase(); // Convert extension to lowercase
    if (lowerExt === ".jpg" || lowerExt === ".jpeg" || lowerExt === ".png" || lowerExt === ".mp4") {
        return true;
    } else {
        return false;
    }
}

module.exports = { validateExtension };
