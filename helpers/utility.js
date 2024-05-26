const jwt = require("jsonwebtoken");
const models = require('../models');
const { format } = require('date-fns');
const { id } = require('date-fns/locale'); 

const getThemehub = () => {
  const theme_hub = [1, 2, 3, 4, 5];
  return theme_hub[Math.floor(Math.random() * theme_hub.length)];
}

const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.user_name },
    process.env.SECRET_KEY,
    { expiresIn: "365d" }
  );
};

const getUserId = (req) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  return decodedToken.userId;
}

const verifyAccessToken = async (token) => {
  try {
    const secret = process.env.SECRET_KEY;

    const decoded = jwt.verify(token, secret);
    // console.log(decoded)
    if (!decoded) {
      throw Error("Proses Autentikasi Gagal");
    }
    return { success: true, token: decoded };
  } catch (error) {
    return {
      success: false,
      message: "Server Error",
      error_code: 500,
    };
  }
};

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const backgrounCards = [
  {
    id: 1,
    bg1: 'dadasdad',
    icon1: 'dadadadada',
    card1: 'dadadadadhau'
  },
  {
    id: 2,
    bg1: 'jgfjfjfjf',
    icon1: 'fjfjfjfjf',
    card1: 'fjjfjfffj'
  }
]

const getUserProfileCard = async (username) => {
  const user = await models.User.findOne({
    where: {
      username: username
    }
  })

  for (let bgCard of backgrounCards) {
    if (bgCard.id == user.theme_hub)
      return {
        bg: bgCard.bg1,
        icon: bgCard.icon1,
        card: bgCard.card1
      }
  }
}

const formatDate = (date, dateFormat = 'd-MMM-yyyy') => {
  const options = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const formattedDate = new Intl.DateTimeFormat('id-ID', options).format(new Date(date));
  const [day, month, year] = formattedDate.split(' ');

  return dateFormat
    .replace('d', day)
    .replace('MMM', month)
    .replace('yyyy', year);
};

const formatDates = (obj, dateFields, dateFormat = 'd-MMM-yyyy') => {
  const formattedObj = { ...obj };
  dateFields.forEach(field => {
    if (obj[field]) {
      formattedObj[field] = formatDate(obj[field], dateFormat);
    }
  });
  return formattedObj;
};


module.exports = {
  generateRandomString,
  verifyAccessToken,
  generateAccessToken,
  getUserId,
  getThemehub,
  getUserProfileCard,
  formatDates
};
