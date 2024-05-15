const models = require("../models");
const jwt = require("jsonwebtoken");
const { getUserId } = require("../helpers/utility")

// Create a product
const createProduct = async (req, res) => {
  try {
    const user_id = getUserId(req)
    const checkUser = await models.User.findByPk(user_id)
    if (!checkUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error_code: 404,
      })
    }
    const product = await models.Product.create({ ...req.body, user_id });
    return res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to create product",
      error_code: 400,
    });
  }
};

const getUserProducts = async (req, res) => {
  try {
    const user_id = getUserId(req)
    const products = await models.Product.findAll({
      where: {
        user_id
      }
    });
    //! Buat filter untuk penyembunyikan id 
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: products,
      message: "Products retrieved successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error_code: 500,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const user_id = getUserId(req)
    const products = await models.Product.findAll();
    //! Buat filter untuk penyembunyikan id 
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Products not found",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: products,
      message: "Products retrieved successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error_code: 500,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      data: product,
      message: "Product retrieved successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error retrieving product by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
      error_code: 500,
    });
  }
};

//! Delete and Update Bug
const updateProduct = async (req, res) => {
  try {
    const user_id = getUserId(req)
    const product = await models.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error_code: 404,
      });
    }

    if(user_id === product.user_id) {
      const updatedProduct = await product.update(req.body);
      return res.status(200).json({
        success: true,
        data: updatedProduct,
        message: "Product updated successfully",
        error_code: 0,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to update this product",
        error_code: 400,
      })
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(400).json({
      success: false,
      message: "Failed to update product",
      error_code: 400,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const user_id = getUserId(req)
    const product = await models.Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        error_code: 404,
      });
    }

    if (user_id === product.user_id) {
      await product.destroy();
      return res.status(200).json({
        success: true,
        data: product,
        message: "Product deleted successfully",
        error_code: 0,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this product",
        error_code: 0,
      });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error_code: 500,
    });
  }
};

module.exports = {
  createProduct,
  getUserProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
