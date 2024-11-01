const path = require("path")
const { validateExtension } = require("../validators/file");
const {File} = require("../models");
const { uploadFileToS3, generateSignedUrl, generateSignedUrls, deleteFileFromS3 } = require("../utils/awsS3");


const uploadFile = async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Extract the extension using path.extname
    const ext = path.extname(file.originalname);
    const isValidExt = validateExtension(ext);

    if (!isValidExt) {
      return res.status(400).json({ message: "Invalid file extension" });
    }

    // Pass file and extension to S3 upload function
    const key = await uploadFileToS3({ file, ext });

    let newFile = null;

    if (key) {
       newFile = new File({
        key,
        size: file.size,
        mimetype: file.mimetype,
        uploadedBy: req.user._id,
      });

      await newFile.save();
    }

    console.log("Uploaded file details:", file); // Log file details
    res.status(201).json({ code: 201, status: true, message: "File uploaded successfully", data: {key, _id: newFile._id} });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};
  

// const uploadFiles = async (req, res, next) => {
//   try {
//     const files = req.files; // This will hold all uploaded files
//     if (!files || files.length === 0) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }

//       await Promise.all(files.map(async (file) => {
//       const ext = file.originalname.split('.').pop(); // Get file extension
//       const key = await uploadFileToS3(file, ext); // Upload file to S3
//       // Create a new File document
//       const newFile = new File({
//         key,
//         size: file.size,
//         mimetype: file.mimetype,
//         uploadedBy: req.user._id
//       });
//       await newFile.save(); // Save file metadata
      
//     }));

//     res.status(201).json({ code: 201, status: true, message: "Files uploaded successfully", data: newFile});
//   } catch (error) {
//     next(error);
//   }
// };


// const getSignedUrl = async (req, res, next) => {
//   try {
//     const { key } = req.query;


//     const url = await signedUrl(key);
//     res.status(200).json({ code: 200, status: true, message: "Signed URL generated successfully", data: url });
//   } catch (error) {
//     next(error);
//   }
// };


// const getFiles = async (req, res, next) => {
//   try {
//     const { key } = req.query; // Expect a query parameter `key` for a single file
//     if(!key) {
//       return res.status(400).json({ message: "Key is required" });
//     }
//     if (key) {
//       // Retrieve a single file
//       const file = await File.findOne({ key }); 
//       if (!file) {
//         return res.status(404).json({ message: "File not found" });
//       }

//       // Generate signed URL for the single file
//       const signedUrl = await generateSignedUrl(key);
//       return res.status(200).json({ code: 200, status: true, message: "File retrieved successfully",  data: signedUrl});
//     }


//     // } else {
//     //   // Retrieve multiple files
//     //   const files = await File.find(); // Retrieve all files
//     //   if (!files || files.length === 0) {
//     //     return res.status(404).json({ message: "No files found" });
//     //   }

//     //   const keys = files.map(file => file.key); // Extract keys from the files
//     //   const signedUrls = await generateSignedUrls(keys); // Generate signed URLs for all files
      
//     //   // Check if all keys generated signed URLs successfully
//     //   const missingKeys = keys.filter((key, index) => !signedUrls[index]);
//     //   if (missingKeys.length > 0) {
//     //     return res.status(404).json({ message: `Some files not found: ${missingKeys.join(', ')}` });
//     //   }

//     //   return res.status(200).json({ code: 200, status: true, message: "Files retrieved successfully", data:{signedUrls} });
//     // }
//   } catch (error) {
//     next(error);
//   }
// };

const getFiles = async (req, res, next) => {
  try {
    const { key } = req.query; // Expect a query parameter `key` for a single file
    console.log("Received file key:", key); // Log the key received

    if (!key) {
      return res.status(400).json({ message: "Key is required" });
    }

    if (key) {
      // Retrieve a single file
      const file = await File.findOne({ key }); 
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Generate signed URL for the single file
      const signedUrl = await generateSignedUrl(key);
      return res.status(200).json({ code: 200, status: true, message: "File retrieved successfully", data: signedUrl });
    }
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const {key} = req.query;

    const keyexist = await File.findOne({key});
    if(!keyexist){
      return res.status(400).json({ message: "No file key provided" });
    }
    await deleteFileFromS3(key);
    await File.findOneAndDelete({key});

    res.status(200).json({ code: 200, status: true, message: "File deleted successfully" });
  } catch(error) {
    next(error)
  }
}

// const deleteFiles = async (req, res, next) => {
//   try {
//     // Expect an array of keys in the request query
//     const keys = req.query.keys; 

//     // If keys is a single string, wrap it in an array
//     const keysArray = Array.isArray(keys) ? keys : [keys];

//     // Remove any falsy values (like undefined or empty strings)
//     const filteredKeys = keysArray.filter(Boolean);

//     if (filteredKeys.length === 0) {
//       return res.status(400).json({ message: "No files specified for deletion" });
//     }

//     // Check if all specified keys exist in the database
//     const existingFiles = await File.find({ key: { $in: filteredKeys } });
//     const existingKeys = existingFiles.map(file => file.key);
//     const missingKeys = filteredKeys.filter(key => !existingKeys.includes(key));

//     if (missingKeys.length > 0) {
//       return res.status(404).json({ message: `Some files not found: ${missingKeys.join(', ')}` });
//     }

//     // Delete files from S3 and MongoDB
//     await Promise.all(filteredKeys.map(async (key) => {
//       await deleteFileFromS3(key); // Delete from S3
//       await File.findOneAndDelete({ key }); // Delete metadata from MongoDB
//     }));

//     res.status(200).json({ code: 200, status: true, message: "Files deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };


module.exports = { uploadFile, getFiles, deleteFile };
