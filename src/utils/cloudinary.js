import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadToCloudinary = async function (localPath) {
  if (!localPath) return;
  try {
    const file = await cloudinary.uploader.upload(localPath, {
      resource_type: "image",
    });
    if (!file) throw new Error("failed uploading avatar");
    fs.unlinkSync(localPath);
    return file?.url;
  } catch (error) {
    fs.unlinkSync(localPath);
    console.error("cloudinary error", error);
  }
};
export { uploadToCloudinary };
