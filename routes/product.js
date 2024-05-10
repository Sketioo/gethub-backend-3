const express = require("express");
const productController = require("../controllers/product.controller");

const { authenticateToken } = require("../middleware/check-auth");
const { validateProduct } = require("../middleware/input-validator");

const router = express.Router();

router.get("/products", authenticateToken, productController.getProducts);
router.post("/product", validateProduct, authenticateToken, productController.createProduct);
router.get("/product/:id", authenticateToken, productController.getProductById);
router.put("/product/:id", validateProduct, authenticateToken, productController.updateProduct);
router.delete("/product/:id", authenticateToken, productController.deleteProduct);

module.exports = router;
