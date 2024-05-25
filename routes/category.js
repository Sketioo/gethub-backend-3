const express = require("express");
const categoryController = require("../controllers/category.controller");

const router = express.Router();

const { authenticateToken } = require("../middleware/check-auth")

router.post('/category', authenticateToken, categoryController.createCategory);
router.get('/categories', authenticateToken, categoryController.getAllCategories);
router.get('/category/:id', authenticateToken, categoryController.getCategoryById);
router.put('/category/:id', authenticateToken, categoryController.updateCategory);
router.delete('/category/:id', authenticateToken, categoryController.deleteCategory);

// router.get('/user/certifications', authenticateToken, certificateController.getUserCertifications);
module.exports = router;