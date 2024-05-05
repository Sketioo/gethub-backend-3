const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const models = require("../models");

const upload = multer({
  storage: multer.memoryStorage(),
});

const storage = new Storage({
  keyFilename: "sa-key.json",
});

const imageExtensions = ['jpg', 'jpeg', 'png'];

const imageUploader = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({
      success: false,
      message: "Please upload a file",
      error_code: 400,
    });
  }

  const fileExtension = file.originalname.split(".").pop().toLowerCase();
  if (!imageExtensions.includes(fileExtension)) {
    return res.status(400).send({
      success: false,
      message: "Invalid file type. Only image files are allowed.",
      error_code: 400,
    });
  }

  const fileName = `${Date.now()}${file.originalname}`;

  const bucketName = "gethub_bucket";
  const bucket = storage.bucket(bucketName);

  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: { contentType: file.mimetype },
  });

  blobStream.on("error", (err) => {
    console.error(`There is an error: ${err}`);
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error_code: 500,
    });
  });

  blobStream.on("finish", async () => {
    const publicUrl = `https://storage.cloud.google.com/${bucketName}/${blob.name}`;

    const uploadedFile = await models.HistoryUpload.create({
      user_id: 1,
      link: publicUrl,
      extension: fileExtension,
      date: Date.now(),
    });
    if (!uploadedFile) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload file",
        error_code: 500,
      });
    }
    res.status(201).json({
      success: true,
      data: publicUrl,
      message: "File uploaded successfully",
      error_code: 0,
    });
  });

  blobStream.end(file.buffer);
};

module.exports = {
  upload,
  imageUploader,
};
