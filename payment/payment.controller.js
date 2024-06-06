const fetch = require('node-fetch');
const midtransClient = require('midtrans-client');
const { getUserId } = require('../helpers/utility');
const models = require('../models');

const url = process.env.URL_SANDBOX;

// Create Snap API instance

//* projects/:id/settlements
async function getDetailSettlement(req, res) {
  try {
    const { id } = req.params;
    const { user_id } = getUserId(req);

    const project = await models.Project.findOne({
      where: {
        id: id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project tidak ditemukan',
        error_code: 404
      });
    }

    if (project.owner_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak diizinkan melihat detail settlement proyek ini',
        error_code: 403
      });
    }

    const responseData = {
      deposit: project.fee_owner_transaction_value,
      service_fee: project.fee_owner_transaction_value * 0.02,
      total: project.fee_owner_transaction_value * 1.02
    };

    return res.status(200).json({
      success: true,
      data: responseData,
      error_code: 0
    });
  } catch (error) {
    console.log('there is an error ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    });
  }
}

//* router.get('/projects/:id/payments')
async function processOwnerTransaction(req, res) {
  try {
    const { user_id } = getUserId(req);
    const { id } = req.params;

    const project = await models.Project.findOne({
      where: {
        id: id,
        owner_id: user_id
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project tidak ditemukan',
        error_code: 404
      });
    }

    const user = await models.User.findByPk(user_id);

    const authString = Buffer.from(`${process.env.SERVER_KEY}:`).toString('base64');

    const feePercentage = 0.02;
    const grossAmount = project.fee_owner_transaction_value;
    const totalAmount = grossAmount * (1 + feePercentage);

    const generateOrderId = () => {
      const timestamp = Date.now();
      const randomNumber = Math.floor(Math.random() * 1000000);
      return `TRX-${timestamp}-${randomNumber}`;
    };

    const payload = {
      transaction_details: {
        order_id: generateOrderId(),
        gross_amount: totalAmount
      },
      item_details: [
        {
          id: project.id,
          price: totalAmount,
          quantity: 1,
          name: project.title
        }
      ],
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      }
    };

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic ${authString}`
      },
      body: JSON.stringify(payload)
    };

    const response = await fetch(url, options);
    const json = await response.json();

    if (!json) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error_code: 500
      })
    }

    await models.Transaction.create({
      project_id: project.id,
      user_id: user.id,
      amount: grossAmount,
      transaction_type: 'DEPOSIT',
      status: 'COMPLETED',
      payment_method: 'BCA',
      snap_token: json.token,
      snap_redirect: json.redirect_url
    });

    return res.status(200).json({
      success: true,
      message: 'Transaksi berhasil',
      data: json,
      error_code: 0
    });

  } catch (error) {
    console.log("Error in payment process: ", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    });
  }
}


async function getOwnerTransactions(req, res) {
  try {
    const { user_id } = getUserId(req);

    const transactions = await models.Transaction.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: models.Project,
          as: 'project',
          attributes: ['title']
        }
      ],
      order: [['transaction_date', 'DESC']]
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tidak ada transaksi yang ditemukan',
        data: [],
        error_code: 404
      })
    }

    return res.status(200).json({
      success: true,
      data: transactions,
      error_code: 0
    });
  } catch (error) {
    console.error('Ada sebuah error: ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    });
  }
}

async function processPremiumPayment(req, res) {
  try {
    const { id } = req.params;
    const { user_id } = getUserId(req);
    const user = await models.User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        error_code: 404
      });
    }

    const project = await models.Project.findByPk(id)

    const authString = Buffer.from(`${process.env.SERVER_KEY}:`).toString('base64');

    const totalAmount = 10000;

    const generateOrderId = () => {
      const timestamp = Date.now();
      const randomNumber = Math.floor(Math.random() * 1000000);
      return `PREMIUM-${timestamp}-${randomNumber}`;
    };

    const payload = {
      transaction_details: {
        order_id: generateOrderId(),
        gross_amount: totalAmount
      },
      item_details: [
        {
          id: 'premium_membership',
          price: totalAmount,
          quantity: 1,
          name: 'Premium Membership'
        }
      ],
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Basic ${authString}`
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json();

    if (!json || !json.token) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error_code: 500
      });
    }

    await models.Transaction.create({
      project_id: project.id,
      user_id: user_id,
      amount: grossAmount,
      transaction_type: 'PAYMENT',
      status: 'COMPLETED',
      payment_method: 'CREDIT_CARD',
      snap_token: json.token,
      snap_redirect: json.redirect_url
    });

    return res.status(200).json({
      success: true,
      message: 'Premium payment initiated successfully',
      token: json.token,
      redirect_url: json.redirect_url,
      error_code: 0
    });

  } catch (error) {
    console.error('Ada sebuah error: ', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    });
  }
}

module.exports = {
  getDetailSettlement,
  processOwnerTransaction,
  getOwnerTransactions,
  processPremiumPayment
};
