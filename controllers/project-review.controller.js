const models = require('../models');
const { getUserId } = require('../helpers/utility');


const axios = require('axios');

const createReview = async (req, res) => {
  try {
    const { user_id } = getUserId(req);
    const { project_id, message, review_type } = req.body;


    const sentimentResponse = await axios.post('https://machinelearning-api-kot54pmj3q-et.a.run.app/api/sentiment-analysis', 
    { text: message },
      {
        headers: {
          'Authorization': `Bearer ${user_id}`,
          'Content-Type': 'application/json'
        }
      }

    );
    const { sentiment, accuracy: sentiment_score } = sentimentResponse.data.data;

    console.log(sentimentResponse.data.data)

    const sentimentReview = sentiment.toLowerCase();

    if (!['positif', 'netral', 'negatif'].includes(sentimentReview)) {
      return res.status(400).json({
        success: false,
        message: "Nilai sentimen tidak valid. Nilai yang boleh: 'positif', 'netral', 'negatif'",
      });
    }

    const project = await models.Project.findByPk(project_id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project tidak ditemukan',
        error_code: 404
      });
    }

    if (project.status_project !== 'FINISHED') {
      return res.status(400).json({
        success: false,
        message: 'Project ini belum selesai. Tidak ada ulasan yang dapat diberikan',
        error_code: 400
      });
    }

    let isInvolved = false;
    let owner_id, freelancer_id;

    if (review_type === 'owner') {
      const projectBid = await models.Project_User_Bid.findOne({
        where: {
          project_id: project.id,
          user_id: user_id,
          is_selected: true // memastikan bahwa freelancer yang memberikan review adalah yang diterima
        }
      });
      if (projectBid) {
        isInvolved = true;
        freelancer_id = user_id;
        owner_id = project.owner_id;
      }
    } else if (review_type === 'freelancer') {
      if (user_id === project.owner_id) {
        isInvolved = true;
        owner_id = user_id;
        freelancer_id = project.freelancer_id;
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Tipe review tidak valid',
        error_code: 400
      });
    }

    if (!isInvolved) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak diizinkan memberikan ulasan untuk proyek ini',
        error_code: 403
      });
    }

    const existingReview = await models.Project_Review.findOne({
      where: {
        project_id,
        [review_type === 'owner' ? 'freelancer_id' : 'owner_id']: user_id
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah memberikan ulasan kepada pengguna ini sebelumnya',
        error_code: 400
      });
    }

    const newReview = await models.Project_Review.create({
      project_id,
      owner_id,
      freelancer_id,
      message,
      sentiment: sentimentReview,
      sentiment_score
    });

    let listOfProjectReview;
    let userId;
    let sentimentField;
    let scoreField;

    if (review_type === 'owner') {
      listOfProjectReview = await models.Project_Review.findAll({
        where: { owner_id }
      });
      userId = owner_id;
      sentimentField = 'sentiment_owner_analisis';
      scoreField = 'sentiment_owner_score';
    } else if (review_type === 'freelancer') {
      listOfProjectReview = await models.Project_Review.findAll({
        where: { freelancer_id }
      });
      userId = freelancer_id;
      sentimentField = 'sentiment_freelance_analisis';
      scoreField = 'sentiment_freelance_score';
    }

    let totalPositif = 0;
    let totalNegatif = 0;
    let totalNetral = 0;

    listOfProjectReview.forEach(row => {
      if (row.sentiment === 'positif') {
        totalPositif += 1;
      } else if (row.sentiment === 'negatif') {
        totalNegatif += 1;
      } else if (row.sentiment === 'netral') {
        totalNetral += 1;
      }
    });

    let sentimentResult = '';
    let totalSentimentResult = 0;

    if (totalPositif > totalNegatif) {
      sentimentResult = 'positif';
      totalSentimentResult = totalPositif;
    } else if (totalNegatif > totalPositif) {
      sentimentResult = 'negatif';
      totalSentimentResult = totalNegatif;
    } else {
      sentimentResult = 'netral';
      totalSentimentResult = totalNetral;
    }

    const totalScore = listOfProjectReview.reduce((acc, row) => acc + row.sentiment_score, 0);
    const sentimentScore = totalScore / listOfProjectReview.length;

    await models.User.update({
      [sentimentField]: sentimentResult,
      [scoreField]: sentimentScore
    }, {
      where: { id: userId }
    });

    res.status(201).json({
      success: true,
      message: 'Ulasan berhasil dibuat',
      data: newReview,
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




const getAllReview = async (req, res) => {
  try {
    const reviews = await models.models.Project_Review.findAll();
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: 'Tidak ada review yang ditemukan',
        error_code: 404
      })
    }
    res.status(200).json({
      success: true,
      data: reviews,
      message: 'Semua review berhasil diambil',
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

const getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await models.Project_Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review tidak ditemukan',
        error_code: 404
      });
    }
    res.status(200).json({
      success: true,
      data: review,
      message: 'Review berhasil diambil',
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

module.exports = {
  createReview,
  getAllReview,
  getReviewById
};
