const models = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function expressions
const register = async (req, res) => {
  try {
    if (req.body.password !== req.body.password_confirm) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
        error_code: 400,
      });
    }

    const existingUser = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists!",
        success: false,
        error_code: 409,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const newUser = {
      full_name: req.body.full_name,
      user_name: req.body.user_name,
      email: req.body.email,
      password: hash,
      profession: req.body.profession,
      phone: req.body.phone,
      web: req.body.web,
      address: req.body.address,
      photo: req.body.photo,
      about: req.body.about,
    };

    await models.User.create(newUser);
    const { password, ...customizedUser } = newUser;
    console.log(customizedUser);
    return res.status(201).json({
      data: customizedUser,
      message: "User created successfully",
      success: true,
      error_code: 0,
    });
  } catch (error) {
    console.error("Error signing up:", error);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
      error_code: 500,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials!",
        success: false,
        error_code: 401,
      });
    }

    const isPasswordValid = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials!",
        success: false,
        error_code: 401,
      });
    }

    // Save user to session and set login flag
    req.session.currentUser = user;
    req.session.isLoggedIn = true;

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" } // Token expiration time
    );

    const { password, ...userWithoutPassword } = user.dataValues;
    userWithoutPassword.token = token;

    return res.status(200).json({
      message: "Authentication successful!",
      data: userWithoutPassword,
      success: true,
      error_code: 0,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
      error_code: 500,
    });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error("Error destroying session:", error);
        return res.status(500).json({
          message: "Failed to log out",
          success: false,
          error_code: 500,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
        error_code: 0,
      });
    });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({
      message: "Failed to log out",
      success: false,
      error_code: 500,
    });
  }
};

// Get profile by ID
const getProfileById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await models.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error_code: 404,
      });
    }

    // Filter out sensitive data
    const {
      password,
      user_name,
      qr_code,
      is_verify,
      is_premium,
      theme_hub,
      role_id,
      is_complete_profile,
      ...customizedUser
    } = user.dataValues;

    return res.status(200).json({
      success: true,
      data: customizedUser,
      message: "User retrieved successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error getting profile by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

// Get all profiles
const getAllProfiles = async (req, res) => {
  try {
    const users = await models.User.findAll();
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No profiles found",
        error_code: 404,
      });
    }

    // Filter out sensitive data for all users
    const customizedUsers = users.map((user) => {
      const {
        password,
        user_name,
        qr_code,
        is_verify,
        is_premium,
        theme_hub,
        // role_id,
        is_complete_profile,
        ...customizedUser
      } = user.dataValues;
      return customizedUser;
    });

    return res.status(200).json({
      success: true,
      data: customizedUsers,
      message: "All profiles retrieved successfully",
      error_code: 0,
    });
  } catch (error) {
    console.error("Error getting all profiles:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await models.User.update(req.body, {
      where: { id: userId },
    });
    if (updatedUser[0] === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error_code: 404,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await models.User.destroy({
      where: { id: userId },
    });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error_code: 404,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error instanceof Sequelize.ForeignKeyConstraintError) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user due to existing foreign key constraint",
        error_code: 400,
      });
    }

    console.error("Error deleting profile:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

// Helper function for filtering products
const filterProducts = products => products.map(product => ({
  name: product.name,
  price: product.price,
  description: product.description,
  image_url: product.image_url
}));

// Helper function for filtering links
const filterLinks = links => links.map(link => ({
  category: link.category,
  link: link.link,
}));

const getPublicUser = async (req, res) => {
  try {
    const username = req.query.username;
    const user = await models.User.findOne({
      where: { user_name: username },
      include: [
        { model: models.Link, as: 'Links' },
        { model: models.Product, as: 'Products' }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error_code: 404,
      });
    }

    const filteredProducts = filterProducts(user.Products);
    const filteredLinks = filterLinks(user.Links);

    const publicUserData = {
      id: user.id,
      user_name: user.user_name,
      profession: user.profession,
      name: user.full_name,
      phone: user.phone,
      email: user.email,
      web: user.web,
      about: user.about,
      products: filteredProducts,
      links: filteredLinks,
    };

    return res.status(200).json({
      success: true,
      data: publicUserData,
      message: "Public user data retrieved successfully",
    });
  } catch (error) {
    if (error instanceof SequelizeEagerLoadingError) {
      return res.status(400).json({
        success: false,
        message: "Error retrieving public user data",
        error_code: 400,
      });
    }

    console.error("Error retrieving public user data:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error_code: 500,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfileById,
  getAllProfiles,
  updateProfile,
  deleteProfile,
  getPublicUser,
};
