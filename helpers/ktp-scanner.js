const axios = require("axios");
const { getUserId } = require('./utility');
const models = require("../models");

const scanKTP = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
        error_code: 400,
      });
    }

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDkyZTBiMC1hMGRlLTRhY2YtOGFhNy0yZDVmOTc4ODAwMDMiLCJpYXQiOjE3MTcwNTI3NDQsImV4cCI6MTc0ODU4ODc0NH0.c6N9Io7rUBGi0nxEDLzKlwJvAcgt5moMIov4aczulIU';

    const mlResponse = await axios.post(
      "https://machinelearning-api-kot54pmj3q-et.a.run.app/api/scan-ktp",
      {
        image: file.buffer.toString("base64"),
        
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { data } = mlResponse;
    if (data.error_code === 0) {
      const result = data.result;
      const { user_id } = getUserId(req);
      const user = await models.User.findOne({ where: { id: user_id } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          error_code: 404,
        });
      }

      if (result.nama.toLowerCase() === user.name.toLowerCase()) {
        await models.User.update(
          { is_verif_ktp: true },
          { where: { id: user_id } }
        );

        return res.status(200).json({
          success: true,
          message: "KTP verified and matches the user's name",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "KTP uploaded successfully but does not match the user's name",
        });
      }
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to verify KTP",
        error_code: 500,
      });
    }
  } catch (error) {
    console.error("Failed to verify KTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify KTP",
      error_code: 500,
    });
  }
};

module.exports = { scanKTP };
