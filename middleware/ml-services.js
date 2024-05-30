const axios = require('axios')

const { getUserId } = require("../helpers/utility");


const axios = require('axios');

const checkProjectFraud = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const text = `${title} ${description}`;

    const payload = { text };

    const response = await axios.post('https://machinelearning-api-kot54pmj3q-et.a.run.app/api/predict-fraud-job', payload);

    const apiResponse = response.data;
    const predictionResult = apiResponse.data.results[0].prediction;

    if (predictionResult === 'fraud_project_job') {
      return res.status(400).json({
        success: false,
        message: "Project is detected as fraud",
        error_code: 400
      });
    }

    next();
  } catch (error) {
    console.log('There is an error: ', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500
    });
  }
}

module.exports = checkProjectFraud;
