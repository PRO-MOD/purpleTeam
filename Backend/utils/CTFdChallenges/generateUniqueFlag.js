
const crypto = require('crypto');

const generateUniqueFlag = (userId, challengeId) => {
    const secretKey = 'your_secret_key'; // Ensure this key is kept secure
    const data = `${userId}-${challengeId}`;
  
    // Generate a readable hash
    const hash = crypto.createHash('md5').update(data + secretKey).digest('hex');
  
    // Make it readable (e.g., using a base64-like conversion or word list)
    const readableFlag = `FLAG{${hash.slice(0, 8)}}`;
  
    return readableFlag;
  };

  module.exports = generateUniqueFlag;