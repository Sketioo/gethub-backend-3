const axios = require('axios')

const { getUserId } = require("../helpers/utility");


const checkProjectFraud = async (req, res, next) => {
  try {


  } catch (error) {
    console.log('There is an error: ', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500
    })
  }
}