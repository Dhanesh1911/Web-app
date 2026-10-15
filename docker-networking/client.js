
const http = require("http");

function callBackend() {
  http.get("http://backend:3000", (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("Response from backend:");
      console.log(data);
    });
  }).on("error", (err) => {
    console.error("Backend connection failed:", err.message);
  });
}

callBackend();

