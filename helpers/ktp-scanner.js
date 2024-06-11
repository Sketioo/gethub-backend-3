const axios = require('axios').default;
const FormData = require('form-data');
const multer = require('multer');
const { Storage } = require("@google-cloud/storage");
const models = require("../models");
const { uploadImageToBucket } = require('./image-uploader')
const { getUserId } = require('./utility')

const imageExtensions = ['jpg', 'jpeg', 'png'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1.5, // 1.5 MB
  },
}).single('image_file');

const storage = new Storage({
  keyFilename: process.env.KEY_FILENAME
});

const ktpScannerController = async (req, res) => {
  try {
    const { user_id, token } = getUserId(req);
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: "Gagal mengupload file",
          error_code: 400,
        });
      } else if (err) {
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error_code: 500,
        });
      }

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

      // Upload file to Google Cloud Storage bucket
      const publicUrl = await uploadImageToBucket(file);

      // const uploadImageToBucket = async (file) => {
      //   // Google Cloud Storage upload logic
      // };

      // Create form data for API request
      const formData = new FormData();
      formData.append('image_file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await axios.post('https://machinelearning-api-kot54pmj3q-et.a.run.app/api/scan-ktp', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      });

      const scanResult = response.data;

      await models.HistoryUpload.create({
        user_id: user_id,
        link: publicUrl,
        extension: fileExtension,
      })

      const user = await models.User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
          error_code: 404,
        });
      }

      if (scanResult.result.nama.toUpperCase() === user.full_name.toUpperCase()) {
        await user.update({
          is_verif_ktp: true,
        });
      }

      await user.update({
        is_verif_ktp_url: publicUrl
      })

      res.status(201).json({
        success: true,
        data: scanResult,
        message: "KTP berhasil diunggah dan dipindai",
        error_code: 0,
      });
    });
  } catch (error) {
    console.error("Gagal mengunggah dan memindai KTP:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengunggah dan memindai KTP",
      error_code: 500,
    });
  }
};

module.exports = { ktpScannerController };
