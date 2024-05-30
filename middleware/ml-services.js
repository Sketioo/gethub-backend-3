const axios = require('axios');
const { getUserId } = require('../helpers/utility')

const checkProjectFraud = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { token } = getUserId(req)

    const text = `${title} ${description}`;

    const payload = { text };

    const response = await axios.post('https://machinelearning-api-kot54pmj3q-et.a.run.app/api/predict-fraud-job', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const apiResponse = response.data;

    const totalFraud = apiResponse.data.totals.total_fraud;
    const totalRealJob = apiResponse.data.totals.total_real_job;

    if (totalFraud > totalRealJob) {
      return res.status(400).json({
        success: false,
        message: "Proyek terdeteksi sebagai penipuan",
        error_code: 400
      });
    }

    // Jika proyek bukan penipuan, lanjutkan ke middleware/route berikutnya
    next();
  } catch (error) {
    console.log('Terjadi kesalahan: ', error);
    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500
    });
  }
}

module.exports = checkProjectFraud;
