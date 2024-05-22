const http = require("http");
const app = require("./app");
const port = 8080;
const host = process.env.WEB_HOST;

const server = http.createServer(app);

app.listen(port, () => {
  console.log(`Server berjalan di ${host}:${port}`);
});
