const { adminStorage } = require( "../config/firebase");

const UploadImage = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer(); // Convert Blob to ArrayBuffer
    const buffer = Buffer.from(arrayBuffer); // Convert to Buffer

    const bucket = adminStorage.bucket();
    const filePath = `stall-craft/${Date.now()}_${file.name}`; // Generate unique file path
    const firebaseFile = bucket.file(filePath);


    const blobStream = firebaseFile.createWriteStream({
      metadata: { contentType: file.type },
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", reject);
      blobStream.on("finish", async () => {
        const [url] = await firebaseFile.getSignedUrl({ action: "read", expires: "03-09-2491" });
        resolve(url);
      });
      blobStream.end(resizedBuffer);
    });
  } catch (error) {
    throw new Error("Error uploading image: " + error.message);
  }
};

const ReplaceImage = async (file, oldImageUrl) => {
  try {
    const bucket = adminStorage.bucket();

    // Delete old image if exists
    if (oldImageUrl) {
      try {
        console.log("Old Image URL:", oldImageUrl); // Debugging

        let oldFilePath;
        if (oldImageUrl.includes("/o/")) {
          // Handle public URL format
          oldFilePath = oldImageUrl.split("/o/")[1].split("?")[0];
        } else if (oldImageUrl.includes("storage.googleapis.com")) {
          // Handle signed URL format
          const urlParts = oldImageUrl.split("storage.googleapis.com/")[1].split("?")[0];
          // Remove the bucket name from the file path
          oldFilePath = urlParts.split("/").slice(1).join("/");
        } else {
          throw new Error("Invalid old image URL format");
        }

        const decodedOldFilePath = decodeURIComponent(oldFilePath);
        
        // Delete the old image
        await bucket.file(decodedOldFilePath).delete();
        console.log("Old image deleted:", decodedOldFilePath);
      } catch (deleteError) {
        console.warn("Failed to delete old image:", deleteError.message);
        throw new Error("Failed to delete old image: " + deleteError.message);
      }
    }

    // Upload new image if provided
    if (file) {
      return await UploadImage(file);
    } else {
      return null; // Return null if no new image is provided
    }
  } catch (error) {
    throw new Error("Error replacing image: " + error.message);
  }
};

module.exports = { UploadImage, ReplaceImage };