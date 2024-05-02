const models = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const result = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (result) {
      return res
        .status(409)
        .json({ error_code: 409, data: {}, message: "Email already exists!" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const user = {
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

    await models.User.create(user);
    const { password, ...userWithoutPw } = user;
    return res.status(201).json({
      error_code: 0,
      data: {
        user: userWithoutPw,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error_code: 500, data: {}, message: "Something went wrong!" });
  }
};

const login = async (req, res) => {
  try {
    const user = await models.User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return res
        .status(401)
        .json({ error_code: 401, data: {}, message: "Invalid credentials!" });
    }

    const result = await bcryptjs.compare(req.body.password, user.password);
    if (result) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user.id,
        },
        process.env.JWT_KEY
      );
      return res.status(200).json({
        message: "Authentication successful!",
        data: { user },
        token: token,
      });
    } else {
      return res
        .status(401)
        .json({ error_code: 0, data: {}, message: "Invalid credentials!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error_code: 500, message: "Something went wrong!" });
  }
};

module.exports = {
  signUp: signUp,
  login: login,
};
