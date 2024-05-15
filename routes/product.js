const express = require("express");
const productController = require("../controllers/product.controller");

const { authenticateToken } = require("../middleware/check-auth");
const { validateProduct } = require("../middleware/input-validator");

const router = express.Router();

router.get("/products", authenticateToken, productController.getUserProducts);
router.post("/product", authenticateToken, validateProduct, productController.createProduct);
router.get("/product/:id", authenticateToken, productController.getProductById);
router.put("/product/:id", authenticateToken, validateProduct, productController.updateProduct);
router.delete("/product/:id", authenticateToken, productController.deleteProduct);

//* ADMIN
router.get("/admin/products", authenticateToken, productController.getAllProducts);



module.exports = router;
