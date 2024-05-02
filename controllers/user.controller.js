const models = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// console.dir(models)
// console.dir(models.User._attributeManipulation)
// console.log('------------')

const signUp = async (req, res) => {
  try {
    const existingUser = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return res.status(409).json({
        error_code: 409,
        message: "Email already exists!",
        success: false
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
    const { password, ...userWithoutPassword } = newUser;
    return res.status(201).json({
      error_code: 0,
      data: userWithoutPassword,
      message: "User created successfully",
      success: true
    });
  } catch (error) {
    console.error("Error signing up:", error);
    return res.status(500).json({
      error_code: 500,
      message: "Something went wrong!",
      success: false
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
        error_code: 401,
        message: "Invalid credentials!",
        success: false
      });
    }

    const isPasswordValid = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        error_code: 401,
        message: "Invalid credentials!",
        success: false
      });
    }

    // Save user to session and set login flag
    req.session.user = user;
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
      success: true
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      error_code: 500,
      message: "Something went wrong!",
      success: false
    });
  }
};


const logout = async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        console.error('Error destroying session:', error);
        return res.status(500).json({
          error_code: 500,
          message: 'Failed to log out',
          success: false
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({
      error_code: 500,
      message: 'Failed to log out',
      success: false
    });
  }
};


module.exports = {
  signUp,
  login,
  logout
};
