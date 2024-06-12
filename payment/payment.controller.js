const fetch = require('node-fetch');
const { formatDates } = require('../helpers/utility');
const { getUserId } = require('../helpers/utility');
const moment = require('moment');
const models = require('../models');

const url = process.env.URL_SANDBOX;

// Create Snap API instance

//* projects/:id/settlements
async function getDetailPayment(req, res) {
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
// async function processOwnerTransaction(req, res) {
//   try {
//     const { user_id } = getUserId(req);
//     const { id } = req.params;
//     const { freelancer_id } = req.body;

//     const project = await models.Project.findOne({
//       where: {
//         id: id,
//         owner_id: user_id
//       }
//     });

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project tidak ditemukan',
//         error_code: 404
//       });
//     }

//     const user = await models.User.findByPk(user_id);
//     const authString = Buffer.from(`${process.env.SERVER_KEY}:`).toString('base64');
//     const feePercentage = 0.02;
//     const grossAmount = project.fee_owner_transaction_value;
//     const totalAmount = grossAmount * (1 + feePercentage);

//     const generateOrderId = () => {
//       const timestamp = Date.now();
//       const randomNumber = Math.floor(Math.random() * 1000000);
//       return `TRX-${timestamp}-${randomNumber}`;
//     };

//     const order_id = generateOrderId();

//     const payload = {
//       transaction_details: {
//         order_id,
//         gross_amount: totalAmount
//       },
//       item_details: [
//         {
//           id: project.id,
//           price: totalAmount,
//           quantity: 1,
//           name: project.title
//         }
//       ],
//       credit_card: {
//         secure: true
//       },
//       customer_details: {
//         first_name: user.full_name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//       }
//     };

//     const options = {
//       method: 'POST',
//       headers: {
//         accept: 'application/json',
//         'content-type': 'application/json',
//         authorization: `Basic ${authString}`
//       },
//       body: JSON.stringify(payload)
//     };

//     const response = await fetch(url, options);
//     const json = await response.json();

//     if (!json) {
//       return res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//         error_code: 500
//       });
//     }

//     await models.Transaction.create({
//       id: order_id,
//       project_id: project.id,
//       user_id: user.id,
//       amount: grossAmount,
//       transaction_type: 'DEPOSIT',
//       status: 'PENDING',
//       payment_method: null,
//       snap_token: json.token,
//       snap_redirect: json.redirect_url,
//       order_id: payload.transaction_details.order_id
//     });

//     return res.status(200).json({
//       success: true,
//       message: 'Transaksi berhasil',
//       data: json,
//       error_code: 0
//     });

//   } catch (error) {
//     console.error("Error in payment process: ", error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error_code: 500
//     });
//   }
// }

async function processOwnerTransaction(req, res) {
  try {
    const { user_id } = getUserId(req);
    const { id } = req.params;
    const { freelancer_id } = req.body;

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

    // Fungsi untuk membuat order_id
    const generateOrderId = () => {
      const timestamp = Date.now();
      const randomNumber = Math.floor(Math.random() * 1000000);
      return `TRX-${timestamp}-${randomNumber}`;
    };

    const order_id = generateOrderId();

    // Payload untuk permintaan transaksi
    const payload = {
      transaction_details: {
        order_id,
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
      });
    }

    await models.Transaction.create({
      id: order_id,
      project_id: project.id,
      user_id: user.id,
      amount: grossAmount,
      transaction_type: 'DEPOSIT',
      status: 'PENDING',
      payment_method: null,
      snap_token: json.token,
      snap_redirect: json.redirect_url,
      order_id: payload.transaction_details.order_id
    });

    const bid = await models.Project_User_Bid.update(
      { is_selected: true },
      {
        where: { project_id: id, user_id: freelancer_id }
      }
    );

    console.log(bid, freelancer_id, id)

    return res.status(200).json({
      success: true,
      message: 'Transaksi berhasil',
      data: json,
      error_code: 0
    });

  } catch (error) {
    console.error("Error in payment process: ", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    });
  }
}



async function verifyTransactionStatus(req, res) {
  try {
    const { id } = req.params;
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
    console.log(json)

    if (!json) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error_code: 500
      });
    }

    const transaction = await models.Transaction.findOne({
      where: {
        id: id
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan',
        error_code: 404
      });
    }

    await transaction.update({
      status: json.transaction_status === 'capture' ? 'COMPLETED' : json.transaction_status.toUpperCase(),
      payment_type: json.payment_type,
      transaction_time: json.transaction_time,
      bank: json.bank,
      gross_amount: json.gross_amount
    });

    return res.status(200).json({
      success: true,
      message: 'Status transaksi berhasil diperbarui',
      data: json,
      error_code: 0
    });

  } catch (error) {
    console.log("Error in verifying transaction status: ", error);
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

// async function processPremiumPayment(req, res) {
//   try {
//     const { user_id } = getUserId(req);
//     const user = await models.User.findByPk(user_id);

//     if (user.is_premium === true && user.premium_expired_date && moment(user.premium_expired_date).isAfter(moment())) {
//       return res.status(400).json({
//         success: false,
//         message: 'Anda sudah menjadi premium',
//         error_code: 400
//       });
//     }

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User tidak ditemukan',
//         error_code: 404
//       });
//     }

//     const authString = Buffer.from(`${process.env.SERVER_KEY}:`).toString('base64');

//     const totalAmount = 10000;

//     const generateOrderId = () => {
//       const timestamp = Date.now();
//       const randomNumber = Math.floor(Math.random() * 1000000);
//       return `PREMIUM-${timestamp}-${randomNumber}`;
//     };

//     const order_id = generateOrderId();
//     console.log(`Generated order_id: ${order_id}`);

//     const payload = {
//       transaction_details: {
//         order_id,
//         gross_amount: totalAmount
//       },
//       item_details: [
//         {
//           id: 'premium_membership',
//           price: totalAmount,
//           quantity: 1,
//           name: 'Premium Membership'
//         }
//       ],
//       credit_card: {
//         secure: true
//       },
//       customer_details: {
//         first_name: user.full_name,
//         email: user.email,
//         phone: user.phone,
//         address: user.address
//       }
//     };

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'accept': 'application/json',
//         'content-type': 'application/json',
//         'authorization': `Basic ${authString}`
//       },
//       body: JSON.stringify(payload)
//     });

//     const json = await response.json();
//     console.log('Response from Midtrans charge:', json);

//     if (!json || !json.token) {
//       return res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//         error_code: 500
//       });
//     }

//     await models.Transaction.create({
//       id: order_id,
//       project_id: null,
//       user_id: user_id,
//       amount: totalAmount,
//       transaction_type: 'PAYMENT',
//       status: 'PENDING',
//       payment_method: null,
//       snap_token: json.token,
//       snap_redirect: json.redirect_url
//     });

//     const premiumExpiredDate = moment().add(1, 'months').toDate();

//     await models.User.update({ is_premium: true, premium_expired_date: premiumExpiredDate }, { where: { id: user_id } });

//     return res.status(200).json({
//       success: true,
//       message: 'Pembayaran premium sukses!',
//       token: json.token,
//       redirect_url: json.redirect_url,
//       error_code: 0
//     });

//   } catch (error) {
//     console.error('Ada sebuah error: ', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       error_code: 500
//     });
//   }
// }

async function processPremiumPayment(req, res) {
  try {
    const { user_id } = getUserId(req);
    const user = await models.User.findByPk(user_id);

    if (user.is_premium === true && user.premium_expired_date && moment(user.premium_expired_date).isAfter(moment())) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah menjadi premium',
        error_code: 400
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
        error_code: 404
      });
    }

    const authString = Buffer.from(`${process.env.SERVER_KEY}:`).toString('base64');

    const totalAmount = 10000;

    const generateOrderId = () => {
      const timestamp = Date.now();
      const randomNumber = Math.floor(Math.random() * 1000000);
      return `PREMIUM-${timestamp}-${randomNumber}`;
    };

    const order_id = generateOrderId();
    console.log(`Generated order_id: ${order_id}`);

    const payload = {
      transaction_details: {
        order_id,
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
    console.log('Response from Midtrans charge:', json);

    if (!json || !json.token) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error_code: 500
      });
    }

    await models.Transaction.create({
      id: order_id,
      project_id: null,
      user_id: user_id,
      amount: totalAmount,
      transaction_type: 'PAYMENT',
      status: 'PENDING',
      payment_method: null,
      snap_token: json.token,
      snap_redirect: json.redirect_url
    });

    const premiumExpiredDate = moment().add(1, 'months').toDate();

    await models.User.update({ is_premium: true, premium_expired_date: premiumExpiredDate }, { where: { id: user_id } });

    return res.status(200).json({
      success: true,
      message: 'Pembayaran premium sukses!',
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

const getBanks = async (req, res) => {
  try {
    const banks = await models.Bank.findAll({
      attributes: ['bank_name']
    });

    res.status(200).json({
      success: true,
      data: banks,
      error_code: 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    });
  }
};


//* Freelancer
const createSettlement = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = getUserId(req);
    const { rekening_account, rekening_bank, rekening_number } = req.body;

    console.log(req.body);
    const project = await models.Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyek tidak ditemukan",
        error_code: 404,
      });
    }

    if (project.status_project !== 'FINISHED') {
      return res.status(400).json({
        success: false,
        message: "Proyek harus selesai dikerjakan",
        error_code: 400,
      });
    }

    const user_bid = await models.Project_User_Bid.findOne({
      where: {
        project_id: id,
        user_id: user_id,
        is_selected: true,
      },
    });

    if (!user_bid) {
      return res.status(400).json({
        success: false,
        message: "Anda harus memilih bid terlebih dahulu",
        error_code: 400,
      });
    }

    let total = user_bid.budget_bid;
    const feePercentage = 0.08;
    const total_fee_application = total * feePercentage;
    const total_diterima = total - total_fee_application;

    const settlement = await models.Settlement.create({
      project_id: id,
      freelancer_id: user_id,
      total,
      total_fee_application,
      total_diterima,
      rekening_account,
      rekening_bank,
      rekening_number,
      status: 'WAITING',
      bukti_transfer: null,
      message: null,
    });

    await models.Project.update(
      { status_payment: 'SETTLEMENT' },
      { where: { id: id } }
    );

    return res.status(201).json({
      success: true,
      message: 'Settlement berhasil disimpan',
      data: settlement,
      error_code: 0,
    });
  } catch (error) {
    console.error("Kesalahan saat menyimpan settlement pembayaran:", error);
    return res.status(500).json({
      success: false,
      message: 'Kesalahan internal server',
      error_code: 500,
    });
  }
};


const getSettlementByProjectId = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await models.Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyek tidak ditemukan',
        error_code: 404
      });
    }

    if (project.status_project !== 'FINISHED') {
      return res.status(400).json({
        success: false,
        message: 'Proyek harus selesai dikerjakan',
        error_code: 400
      })
    }

    const offerReceived = project.fee_freelance_transaction_value;
    const serviceFee = project.fee_freelance_transaction_value * 0.08;
    const totalReceived = offerReceived - serviceFee;

    const responseData = {
      job_status: project.status_project === 'FINISHED' ? 'Selesai' : 'Tidak Selesai',
      offer_received: offerReceived,
      service_fee: serviceFee,
      total: totalReceived,
    }

    return res.status(200).json({
      success: true,
      data: responseData,
      message: 'Settlement ditemukan',
      error_code: 0
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil settlement:", error);
    return res.status(500).json({
      success: false,
      message: 'Kesalahan internal server',
      error_code: 500
    });
  }
};


const updateSettlement = async (req, res) => {
  try {
    const { user_id } = getUserId(req);
    const { projectId, settlementId } = req.params;
    const { status, bukti_transfer, message } = req.body;

    const user = await models.User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
        error_code: 404
      });
    }

    // const category = await models.Category.findByPk(user.category_id);
    // if (!category || category.name !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Anda tidak memiliki izin untuk melakukan ini",
    //     error_code: 403
    //   });
    // }

    const settlement = await models.Settlement.findByPk(settlementId);
    if (!settlement || settlement.project_id !== projectId) {
      return res.status(404).json({
        success: false,
        message: "Settlement tidak ditemukan pada project ini",
        error_code: 404
      });
    }

    if (status !== undefined) {
      settlement.status = status;
    }
    if (bukti_transfer !== undefined) {
      settlement.bukti_transfer = bukti_transfer;
    }
    if (message !== undefined) {
      settlement.message = message;
    }

    await settlement.save();

    return res.status(200).json({
      success: true,
      message: "Settlement updated successfully",
      data: settlement,
      error_code: 0
    });
  } catch (error) {
    console.error("Error updating settlement:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500
    });
  }
};

const getAllSettlements = async (req, res) => {
  try {
    const settlements = await models.Settlement.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: models.Project, as: 'project' },
        { model: models.User, as: 'freelancer' }
      ]
    });

    const countSettlements = await models.Settlement.count()

    if (!settlements || settlements.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        total_data: countSettlements,
        message: 'Settlement tidak ditemukan',
        error_code: 404
      })
    }

    return res.status(200).json({
      success: true,
      data: settlements,
      total_data: countSettlements,
      message: 'Settlement berhasil diambil',
      error_code: 0
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil semua settlement:", error);
    return res.status(500).json({
      success: false,
      message: 'Kesalahan internal server',
      error_code: 500
    });
  }
};

const getInvoicePayment = async (req, res) => {
  try {
    const { user_id } = getUserId(req);

    const transactions = await models.Transaction.findAll({
      where: { user_id: user_id },
      attributes: ['id', 'amount', 'status', 'transaction_date', 'snap_token', 'snap_redirect']
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tidak ada transaksi yang ditemukan',
        data: [],
        error_code: 404
      });
    }

    const authString = Buffer.from(`${process.env.SERVER_KEY}:`).toString('base64');

    const updateTransactionStatus = async (transaction) => {
      console.log(transaction.id)
      const check_url = `https://api.sandbox.midtrans.com/v2/${transaction.id}/status`;
      const statusResponse = await fetch(check_url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': `Basic ${authString}`
        }
      });

      const statusJson = await statusResponse.json();
      console.log('Response from Midtrans status:', statusJson);

      if (statusJson.status_code === '200') {
        transaction.payment_method = statusJson.payment_type;
        if (statusJson.transaction_status === 'settlement') {
          transaction.status = 'COMPLETED';  
        } else if (statusJson.transaction_status === 'expire') {
          transaction.status = 'FAILED';  
        }
        await transaction.save();
      } else {
        console.error(`Failed to get status for order_id ${transaction.id} ${statusJson.status_code}`);
      }
    };

    for (let transaction of transactions) {
      await updateTransactionStatus(transaction);
    }

    const formattedTransaction = transactions.map(trans => {
      const transactionData = trans.toJSON();
      const formattedTransDate = formatDates(transactionData, ['transaction_date']);
      return formattedTransDate;
    });

    return res.status(200).json({
      success: true,
      data: formattedTransaction,
      message: 'Transaksi ditemukan',
      error_code: 0
    });

  } catch (error) {
    console.error("Ada sebuah error: ", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error_code: 500
    });
  }
};



module.exports = {
  getDetailPayment,
  processOwnerTransaction,
  getOwnerTransactions,
  processPremiumPayment,
  verifyTransactionStatus,
  createSettlement,
  getAllSettlements,
  updateSettlement,
  getBanks,
  getSettlementByProjectId,
  getInvoicePayment
};
