const axios = require("axios");
const querystring = require("querystring");

const generateLinkedinAuthorization = () => {
  return encodeURI(
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&state=987654321&scope=${process.env.SCOPE}&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`
  );
};

const processLinkedinRedirect = async (code) => {
  const payload = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };

  const data = await axios
    .post(
      `https://www.linkedin.com/oauth/v2/accessToken`,
      querystring.stringify(payload),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err; 
    });

  return data;
};



module.exports = {
  generateLinkedinAuthorization,
  processLinkedinRedirect,
};
