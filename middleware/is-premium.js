
const models = require("../models");

const { getUserId } = require("../helpers/utility");

exports.isPremium = (req, res, next) => {
  try {
    //* Owner
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

exports.checkPaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { freelancer_id } = req.body;
    const transaction = await models.Transaction.findOne({
      where: {
        project_id: id,
        status: 'PENDING'
      }
    })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan',
        error_code: 404
      })
    }

    const authString = Buffer.from(`${process.env.SERVER_KEY}:`).toString('base64');
    const url = `https://api.sandbox.midtrans.com/v2/${transaction.id}/status`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: `Basic ${authString}`
      }
    };

    const response = await fetch(url, options);
    const json = await response.json();

    if (json.transaction_status.toLowerCase() === 'settlement') {
      const transaction = await models.Transaction.findOne({ where: { id: transaction.id } });

      if (transaction) {

        await models.Project_User_Bid.update(
          { is_selected: true },
          {
            where: { project_id: transaction.project_id, user_id: freelancer_id }
          }
        );

        await models.Project.update(
          {
            status_project: 'CLOSE',
            status_freelance_task: 'CLOSE',
            fee_owner_transaction_value: selectedBidder.budget_bid,
            fee_freelance_transaction_value: selectedBidder.budget_bid,
          },
          { where: { id } }
        );

        await transaction.update({ status: 'COMPLETED' });
      }
    }

    next();
  } catch (error) {
    console.error("Error in checking payment status: ", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    });
  }
};
