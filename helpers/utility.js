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
  return {
    token: token,
    user_id: decodedToken.userId
  }
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
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card1/backgroundCard.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card1/getHub.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card1/card1.png',
    isPremium: false
  },
  {
    id: 2,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card2/backgroundCard.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card2/gethub.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card2/card2.png  ',
    isPremium: false
  },
  {
    id: 3,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card3/backgroundCard.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card3/gethub.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card3/card3.png',
    isPremium: false
  },
  {
    id: 4,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card4/backgroundCard.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card4/gethub.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card4/card4.png',
    isPremium: false
  },
  {
    id: 5,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card5/backgroundCard.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card5/gethub.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card5/card5.png',
    isPremium: false
  },
  {
    id: 6,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card6/backgroundCard.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card6/gethub.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card6/card6.png',
    isPremium: false
  },
  {
    id: 7,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card7/backgroundCard.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card7/gethub.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card7/card7.png',
    isPremium: true
  },
  {
    id: 8,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card8/backgroundCard.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card8/gethub.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card8/card8.png',
    isPremium: true
  },
  {
    id: 9,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card9/backgroundCard.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card9/gethub.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card9/card9.png',
    isPremium: true
  },
  {
    id: 10,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card10/bg.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card10/icon.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card10/card.png  ',
    isPremium: true
  },
  {
    id: 11,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card11/bg.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card11/icon.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card11/card.png',
    isPremium: true
  },
  {
    id: 12,
    bg: 'https://storage.googleapis.com/gethub_bucket/CARD/card12/bg.png',
    icon: 'https://storage.googleapis.com/gethub_bucket/CARD/card12/icon.png',
    card: 'https://storage.googleapis.com/gethub_bucket/CARD/card12/card12.png',
    isPremium: true
  }
]

const getUserProfileCard = async (username) => {
  const user = await models.User.findOne({ where: { username: username } });

  for (let bgCard of backgrounCards) {
    if (bgCard.id === user.theme_hub) {
      if (user.is_premium || !bgCard.isPremium) {
        return {
          bg: bgCard.bg,
          icon: bgCard.icon,
          card: bgCard.card
        };
      }
    }
  }return {
    message : "User tidak dapat menggunakan theme ini"
  }
};

const formatDate = (date, dateFormat = 'd-MMM-yyyy') => {
  return format(new Date(date), dateFormat, { locale: id });
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

const getUserIdByUsername = async (username) => {
  const user = await models.User.findOne({ where: { username: username } });
  return user.id;
};

module.exports = {
  generateRandomString,
  verifyAccessToken,
  generateAccessToken,
  getUserId,
  getThemehub,
  getUserProfileCard,
  formatDates,
  getUserIdByUsername,
};
