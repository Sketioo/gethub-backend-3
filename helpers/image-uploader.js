const { Storage } = require("@google-cloud/storage");
const models = require("../models");
const { getUserId } = require('./utility')

const multer = require("multer");

const imageExtensions = ['jpg', 'jpeg', 'png'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1.5,
  },
});

const storage = new Storage({
  keyFilename: process.env.KEY_FILENAME
});

const uploadImageToBucket = async (file) => {
  return new Promise((resolve, reject) => {
    const bucketName = process.env.BUCKET;
    const bucket = storage.bucket(bucketName);

    const fileNameWithoutSpaces = file.originalname.replace(/\s+/g, "-");
    const fileName = `${Date.now()}${fileNameWithoutSpaces}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on("error", (err) => {
      console.error(`Terjadi kesalahan: ${err}`);
      reject(err);
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

const imageUploader = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({
      success: false,
      message: "Mohon unggah sebuah file",
      error_code: 400,
    });
  }

  // Check file size
  if (file.size > 1024 * 1024 * 1.5) {
    return res.status(400).send({
      success: false,
      message: "Ukuran file melebihi batas maksimal (1.5 MB)",
      error_code: 400,
    });
  }

  const fileExtension = file.originalname.split(".").pop().toLowerCase();
  if (!imageExtensions.includes(fileExtension)) {
    return res.status(400).send({
      success: false,
      message: "Jenis file tidak valid. Hanya file gambar yang diperbolehkan.",
      error_code: 400,
    });
  }

  try {
    const publicUrl = await uploadImageToBucket(file);
    const { user_id } = getUserId(req);
    const uploadedFile = await models.HistoryUpload.create({
      user_id: user_id,
      link: publicUrl,
      extension: fileExtension,
    });
    console.dir(uploadedFile);
    res.status(201).json({
      success: true,
      data: publicUrl,
      message: "File berhasil diunggah",
      error_code: 0,
    });
  } catch (error) {
    console.error("Gagal mengunggah file:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengunggah file",
      error_code: 500,
    });
  }
};

module.exports = {
  imageUploader,
  uploadImageToBucket,
  upload
};
