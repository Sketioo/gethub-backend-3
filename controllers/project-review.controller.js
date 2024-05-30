const models = require('../models');
const { getUserId } = require("../helpers/utility");

// Create a review for a freelancer
const createFreelancerReview = async (req, res) => {
  try {
    const {user_id} = getUserId(req);
    const { freelancer_id, message, sentiment, sentiment_score } = req.body;
    
    const freelancer = await models.User.findByPk(freelancer_id);

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found",
        error_code: 404,
      });
    }

    const review = await models.Project_Review_Freelance.create({
      freelancer_id,
      owner_id: user_id,
      message,
      sentiment,
      sentiment_score,
    });

    const ownerReviews = await models.Project_Review_Freelance.findAll({
      where: { owner_id: user_id }
    });

    let totalPositif = 0;
    let totalNegatif = 0;
    let totalNetral = 0;

    ownerReviews.forEach(review => {
      if (review.sentiment === "Positif") {
        totalPositif++;
      } else if (review.sentiment === "Negatif") {
        totalNegatif++;
      } else if (review.sentiment === "Netral") {
        totalNetral++;
      }
    });

    let sentimentResult = "";
    let totalSentimentResult = 0;

    if (totalPositif > totalNegatif) {
      sentimentResult = "Positif";
      totalSentimentResult = totalPositif;
    } else if (totalNegatif > totalPositif) {
      sentimentResult = "Negatif";
      totalSentimentResult = totalNegatif;
    } else {
      sentimentResult = "Netral";
      totalSentimentResult = totalNetral;
    }

    await models.User.update({
      sentiment_owner_analisis: sentimentResult,
      sentiment_owner_score: totalSentimentResult
    }, {
      where: { id: user_id }
    });

    return res.status(201).json({
      success: true,
      data: review,
      message: "Review created successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error creating freelancer review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500,
    });
  }
};

// Get a freelancer review by ID
const getProjectReviewFreelanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await models.Project_Review_Freelance.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        error_code: 404,
      });
    }

    return res.status(200).json({
      success: true,
      data: review,
      message: "Review retrieved successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error getting freelancer review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500,
    });
  }
};

// Update a freelancer review
const updateProjectReviewFreelance = async (req, res) => {
  try {
    const {user_id} = getUserId(req);
    const { id } = req.params;
    const { message, sentiment, sentiment_score } = req.body;

    const review = await models.Project_Review_Freelance.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        error_code: 404,
      });
    }

    if (review.owner_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this review",
        error_code: 403,
      });
    }

    review.message = message;
    review.sentiment = sentiment;
    review.sentiment_score = sentiment_score;

    await review.save();

    const ownerReviews = await models.Project_Review_Freelance.findAll({
      where: { owner_id: user_id }
    });

    let totalPositif = 0;
    let totalNegatif = 0;
    let totalNetral = 0;

    ownerReviews.forEach(review => {
      if (review.sentiment === "Positif") {
        totalPositif++;
      } else if (review.sentiment === "Negatif") {
        totalNegatif++;
      } else if (review.sentiment === "Netral") {
        totalNetral++;
      }
    });

    let sentimentResult = "";
    let totalSentimentResult = 0;

    if (totalPositif > totalNegatif) {
      sentimentResult = "Positif";
      totalSentimentResult = totalPositif;
    } else if (totalNegatif > totalPositif) {
      sentimentResult = "Negatif";
      totalSentimentResult = totalNegatif;
    } else {
      sentimentResult = "Netral";
      totalSentimentResult = totalNetral;
    }

    // Update sentiment analysis for owner
    await models.User.update({
      sentiment_owner_analisis: sentimentResult,
      sentiment_owner_score: totalSentimentResult
    }, {
      where: { id: user_id }
    });

    return res.status(200).json({
      success: true,
      data: review,
      message: "Review updated successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error updating freelancer review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500,
    });
  }
};

// Delete a freelancer review
const deleteProjectReviewFreelance = async (req, res) => {
  try {
    const {user_id} = getUserId(req);
    const { id } = req.params;

    const review = await models.Project_Review_Freelance.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        error_code: 404,
      });
    }

    if (review.owner_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this review",
        error_code: 403,
      });
    }

    await review.destroy();

    const ownerReviews = await models.Project_Review_Freelance.findAll({
      where: { owner_id: user_id }
    });

    let totalPositif = 0;
    let totalNegatif = 0;
    let totalNetral = 0;

    ownerReviews.forEach(review => {
      if (review.sentiment === "Positif") {
        totalPositif++;
      } else if (review.sentiment === "Negatif") {
        totalNegatif++;
      } else if (review.sentiment === "Netral") {
        totalNetral++;
      }
    });

    let sentimentResult = "";
    let totalSentimentResult = 0;

    if (totalPositif > totalNegatif) {
      sentimentResult = "Positif";
      totalSentimentResult = totalPositif;
    } else if (totalNegatif > totalPositif) {
      sentimentResult = "Negatif";
      totalSentimentResult = totalNegatif;
    } else {
      sentimentResult = "Netral";
      totalSentimentResult = totalNetral;
    }

    // Update sentiment analysis for owner
    await models.User.update({
      sentiment_owner_analisis: sentimentResult,
      sentiment_owner_score: totalSentimentResult
    }, {
      where: { id: user_id }
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error deleting freelancer review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error_code: 500,
    });
  }
};

module.exports = {
  createFreelancerReview,
  getProjectReviewFreelanceById,
  updateProjectReviewFreelance,
  deleteProjectReviewFreelance,
};
