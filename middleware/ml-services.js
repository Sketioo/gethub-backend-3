const axios = require('axios');
const { getUserId } = require('../helpers/utility');
const models = require('../models');

const checkProjectFraud = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const { token, user_id } = getUserId(req);

    const text = `${title}, ${description}`;
    const payload = { text };

    const response = await axios.post('https://machinelearning-api-kot54pmj3q-et.a.run.app/api/predict-fraud-job', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const apiResponse = response.data;
    const totalFraud = apiResponse.data.totals.total_fraud;
    const totalRealJob = apiResponse.data.totals.total_real_job;

    if (totalFraud > totalRealJob) {
      await models.Project.create({ ...req.body, owner_id: user_id });
      return res.status(400).json({
        success: false,
        message: "Proyek terdeteksi sebagai penipuan",
        error_code: 400
      });
    }

    next();
  } catch (error) {
    if (error.response) {
      console.log('Respons Kesalahan Data:', error.response.data);
      console.log('Respons Kesalahan Status:', error.response.status);
      console.log('Respons Kesalahan Headers:', error.response.headers);
    } else if (error.request) {
      console.log('Permintaan Kesalahan:', error.request);
    } else {
      console.log('Kesalahan:', error.message);
    }
    console.log('Konfigurasi Kesalahan:', error.config);

    return res.status(500).json({
      success: false,
      message: "Kesalahan internal server",
      error_code: 500
    });
  }
}

module.exports = { checkProjectFraud };