const crypto = require('crypto');

// Generate a random 256-bit (32 bytes) key
const secret = crypto.randomBytes(32).toString('hex');
console.log(secret);
