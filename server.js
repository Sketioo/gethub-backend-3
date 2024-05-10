const http = require("http");
const app = require("./app");
const port = 3000;

const server = http.createServer(app);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
