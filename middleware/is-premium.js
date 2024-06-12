
const models = require("../models");
const axios = require("axios");

const { getUserId } = require("../helpers/utility")

exports.isPremium = (req, res, next) => {
  try {
    const { user_id } = getUserId(req)
    const user = models.User.findOne({ where: { id: user_id } })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
        error_code: 404
      })
    }
    if (!user.is_premium) {
      return res.status(403).json({
        success: false,
        message: "Anda bukan user premium",
        error_code: 403
      })
    }
    next()
  } catch (error) {
    console.error(`Terdapat error: ${error}`)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500
    })
  }
}

const checkProjectPayment = async (req, res, next) => {
  try {
    const { user_id } = getUserId(req);

    const project = await models.Project.findOne({
      where: {
        owner_id: user_id
      }
    })

    const transaction = await models.Transaction.findOne({
      where: {
        project_id: project.id,
        status: 'PENDING'
      }
    })

    if(transaction) {
      next()
    }

    if (!project) {
      return res.status(404).json({
        status_code: 404,
        message: 'Project tidak ditemukan',
        success: false,
      })
    }

    const authString = Buffer.from(`${process.env.SERVER_KEY}:`).toString('base64');
    const url = `https://api.sandbox.midtrans.com/v2/${id}/status`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Basic ${authString}`
      }
    };

    const response = await fetch(url, options);
    const json = await response.json();

    if(json.status_code == "404") {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan',
        error_code: 404
      })
    }
    console.log(json)

    
  } catch (error) {
    console.error("There is an error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500
    })
  }
}