  // const cloudinary = require("cloudinary").v2;

  // cloudinary.config({
  //   cloud_name:"dbbrif6tp",
  //   api_key: 828655864685419,
  //   api_secret:"coB2EAy1Pt07kgZX9LU86zqRZCY",
  //   secure: true,
  // });

  // module.exports = cloudinary;

  const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

module.exports = cloudinary;