const { PutObjectCommand, S3Client, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner'); // Import getSignedUrl
const {
  aws_access_key,
  aws_secret_access_key,
  aws_bucket_name,
  aws_region,
} = require("../config/keys");
const generateCode = require("../utils/generateCode");

const client = new S3Client({
  region: aws_region,
  credentials: {
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_access_key,
  },
});

const uploadFileToS3 = async ({file, ext}) => {
  // Generate a unique filename: some_random_number.ext
  const Key = `${generateCode(12)}_${Date.now()}${ext}`; // Use the ext passed from controller

  const params = {
    Bucket: aws_bucket_name,
    Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);

  try {
    await client.send(command);
    return Key; // Return the key if successful
  } catch (error) {
    console.error("Error uploading file to S3:", error); // Improved error logging
    throw error; // Rethrow the error to handle it upstream if needed
  }
};

// const uploadFileToS3 = async (file, ext) => {
//   const Key = `${generateCode(12)}_${Date.now()}.${ext}`; // Generate a unique filename
//   const params = {
//     Bucket: aws_bucket_name,
//     Key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   const command = new PutObjectCommand(params);
//   try {
//     await client.send(command);
//     return Key; // Return the key if successful
//   } catch (error) {
//     console.error("Error uploading file to S3:", error);
//     throw error;
//   }
// };


// const signedUrl = async (Key) => {
//   const params = {
//     Bucket: aws_bucket_name, // Replace with your bucket name
//     Key,
//     Expires: 60 * 60, // 1 hour expiration
//   };

//   const command = new GetObjectCommand(params);

//   try {
//     const url = await getSignedUrl(client, command, { expiresIn: 60 * 60 });
//     return url;
//   } catch (error) {
//     console.error("Error getting signed URL:", error);
//     throw error;
//   }
// };


// Function to generate a signed URL for a single file

const generateSignedUrl = async (Key) => {
  const params = {
        Bucket: aws_bucket_name, // Replace with your bucket name
        Key,
        Expires: 60 * 60, // 1 hour expiration
      };
    
      const command = new GetObjectCommand(params);
    
      try {
        const url = await getSignedUrl(client, command, { expiresIn: 60 * 60 });
        return url;
      } catch (error) {
        console.error("Error getting signed URL:", error);
        throw error;
      }
    };


// Function to generate signed URLs for multiple files
// const generateSignedUrls = async (keys) => {
//   const signedUrls = await Promise.all(keys.map(async (key) => {
//     try {
//       return await generateSignedUrl(key); // Generate signed URL for each key
//     } catch (error) {
//       console.error(`Error generating signed URL for ${key}:`, error);
//       return null; // Return null if there was an error
//     }
//   }));

//   return signedUrls.filter(url => url !== null); // Filter out any null results
// };


const deleteFileFromS3 = async(Key) => {
  const params = {
    Bucket: aws_bucket_name,
    Key,
  }
  
  const command = new DeleteObjectCommand(params);
  try {
    await client.send(command);
    console.log(`File ${Key} deleted from S3.`); // Improved logging
    return true; // Return true if successful
  } catch(error) {
    console.error("Error deleting file from S3:", error);
    throw error; // Rethrow the error to handle it upstream if needed
  }
}

// const deleteFileFromS3 = async (Key) => {
//   const params = {
//     Bucket: aws_bucket_name,
//     Key,
//   };

//   const command = new DeleteObjectCommand(params);
//   try {
//     await client.send(command);
//     console.log(`File ${Key} deleted from S3.`);
//     return true; // Return true if successful
//   } catch (error) {
//     console.error("Error deleting file from S3:", error);
//     throw error;
//   }
// };


module.exports = { uploadFileToS3, generateSignedUrl, deleteFileFromS3 };
