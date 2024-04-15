const cloudinary = require('cloudinary').v2;
const dotenv = require("dotenv").config();


//function to upload resources to Cloudinary    
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    secure: true
  });

const uploadFile = async (file) => { 
    try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    });
    // console.log(result);
      return result
    } catch (error) {
      return error.message;
    }
  };
   
  module.exports = uploadFile;