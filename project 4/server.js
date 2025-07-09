const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Serve static files (css, js, images, html)
  const ext = path.extname(pathname);
  const staticExtensions = [".css", ".js", ".png", ".jpg", ".jpeg"];
  if (staticExtensions.includes(ext)) {
    const filePath = path.join(__dirname, "public", pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("File not found");
      }
      const contentType = {
        ".css": "text/css",
        ".js": "application/javascript",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png"
      }[ext];
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
    return;
  }

  // Serve home
  if (pathname === "/" || pathname === "/index.html") {
    fs.readFile("public/index.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // Serve booking page
  else if (pathname === "/booking.html") {
    fs.readFile("public/booking.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }

  // Handle form submission: /book (POST)
  else if (pathname === "/book" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", () => {
      const parsedData = querystring.parse(body);
      const name = parsedData.name;
      const datetime = parsedData.datetime;
      const session = parsedData.session;

      fs.readFile("public/confirmation.html", "utf-8", (err, html) => {
        if (err) {
          res.writeHead(500);
          res.end("Error loading confirmation page");
        } else {
          const filled = html
            .replace("{{name}}", name)
            .replace("{{session}}", session)
            .replace("{{datetime}}", new Date(datetime).toLocaleString());
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(filled);
        }
      });
    });
  }

  // Fallback
  else {
    res.writeHead(404);
    res.end("404 Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
