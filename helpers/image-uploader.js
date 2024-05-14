const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const { getUserId } = require("../helpers/utility")
const models = require("../models");

const imageExtensions = ['jpg', 'jpeg', 'png'];

const upload = multer({
  storage: multer.memoryStorage(),
});

const storage = new Storage({
  keyFilename: "sa-key.json",
});

const imageUploader = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send({
      success: false,
      message: "Mohon unggah sebuah file",
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

  const fileNameWithoutSpaces = file.originalname.replace(/\s+/g, "-");
  const fileName = `${Date.now()}${fileNameWithoutSpaces}`;

  const bucketName = "gethub_bucket";
  const bucket = storage.bucket(bucketName);

  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: { contentType: file.mimetype },
  });

  blobStream.on("error", (err) => {
    console.error(`Terjadi kesalahan: ${err}`);
    res.status(500).json({
      success: false,
      message: "Gagal mengunggah file",
      error_code: 500,
    });
  });

  blobStream.on("finish", async () => {
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    const user_id = getUserId(req)
    const uploadedFile = await models.HistoryUpload.create({
      user_id: user_id,
      link: publicUrl,
      extension: fileExtension,
      date: Date.now(),
    });
    console.dir(uploadedFile)
    if (!uploadedFile) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengunggah file",
        error_code: 500,
      });
    }
    res.status(201).json({
      success: true,
      data: publicUrl,
      message: "File berhasil diunggah",
      error_code: 0,
    });
  });

  blobStream.end(file.buffer);
};


module.exports = {
  upload,
  imageUploader,
};
