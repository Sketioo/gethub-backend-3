const models = require('../models');
const { getUserId } = require('../helpers/utility');

const { getSentimentAnalysis } = require('../middleware/ml-services')

const { Project_Review, User } = require('../models');

async function createReview(req, res) {
  try {
    const { user_id, token } = getUserId(req);
    const { project_id, target_user_id, message, review_type } = req.body;

    // Tentukan owner_id dan freelancer_id berdasarkan review_type
    let owner_id, freelancer_id;
    if (review_type === 'owner') {
      owner_id = target_user_id;
      freelancer_id = user_id;
    } else if (review_type === 'freelancer') {
      owner_id = user_id;
      freelancer_id = target_user_id;
    } else {
      return res.status(400).json({ error: 'Invalid review_type' });
    }

    // Ambil sentiment analysis
    const sentimentData = await getSentimentAnalysis(message, token);
    const { sentiment, accuracy } = sentimentData;
    const sentiment_score = accuracy;

    // Simpan review ke database
    const review = await Project_Review.create({
      project_id,
      owner_id,
      freelancer_id,
      message,
      sentiment,
      sentiment_score
    });

    // Ambil semua review untuk owner atau freelancer
    const whereCondition = review_type === 'owner' ? { owner_id: target_user_id } : { freelancer_id: target_user_id };
    const reviews = await Project_Review.findAll({ where: whereCondition });

    // Hitung jumlah sentiment
    let totalPositif = 0;
    let totalNegatif = 0;
    let totalNetral = 0;

    reviews.forEach(row => {
      if (row.sentiment === 'Positif') {
        totalPositif += 1;
      } else if (row.sentiment === 'Negatif') {
        totalNegatif += 1;
      } else if (row.sentiment === 'Netral') {
        totalNetral += 1;
      }
    });

    // Tentukan hasil sentiment
    let sentimentResult = '';
    let totalSentimentResult = 0;
    if (totalPositif > totalNegatif) {
      sentimentResult = 'Positif';
      totalSentimentResult = totalPositif;
    } else if (totalNegatif > totalPositif) {
      sentimentResult = 'Negatif';
      totalSentimentResult = totalNegatif;
    } else {
      sentimentResult = 'Netral';
      totalSentimentResult = totalNetral;
    }

    // Update field sentiment analysis pada tabel user
    const updateField = review_type === 'owner' ? 'sentiment_owner_analisis' : 'sentiment_freelance_analisis';
    const updateScoreField = review_type === 'owner' ? 'sentiment_owner_score' : 'sentiment_freelance_score';

    const userIdToUpdate = target_user_id;
    await User.update(
      { [updateField]: sentimentResult, [updateScoreField]: totalSentimentResult },
      { where: { id: userIdToUpdate } }
    );

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating project review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


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
