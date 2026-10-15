
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify({
    message: "Hello from the backend container!",
    container: "backend",
    port: 3000
  }));
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Backend running on port 3000");
});

