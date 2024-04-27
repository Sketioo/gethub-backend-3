// const dotenv = require("dotenv").config();

// const axios = require("axios");

// const accessToken =
//   "AQWQLuv-CNCwar7jKQ1B3DPiW0x3_mfq0zgcN326JhJPD08I2tbWXFKyoEfLUUvLNpFbTYPdV8FNvhgMWGjmOG0Y80IA9JLtYFNMQNBDv9Frcq-yR_-XMJkPsFh4jNNks9T8VG1JcbHAz4C49lJnCGTQgdQ5Co8XcfUaYhYZnJeE9LGMpCzgKzbUYVxuLLkKeRr4J5F-GoIHvZbJkfScenzlKXV5cphx6v485_y9RmBhaZIgy-bEFYcrb2TnxxPVgN_yZUBs8UReXzmVud0--z7eleh8JwXmTUbyulyR1Yvr0HFiJq0sfFVP9KWq69iwtRnWOzBkVCj_rSz4MzAGrC4C87geTA";

// async function getAccessToken(authCode) {
//   try {
//     const response = await axios.post(
//       "https://api.linkedin.com/v2/accessToken",
//       {
//         form: {
//           grant_type: "authorization_code",
//           code: authCode,
//           redirect_uri: "http%3A%2F%2Fapi-university.com",
//           client_id: process.env["CLIENT_ID"],
//           client_secret: process.env["CLIENT_SECRET"],
//         },
//       }
//     );
//   } catch (error) {
//     throw error;
//   }
// }

// async function callEmailAPI(accessToken) {
//   try {
//     const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     return response.data
//   } catch (error) {
//     throw error;
//   }
// }

// async function main() {
//   try {
//     const result = await callEmailAPI(accessToken);
//     return console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// }

// main();
