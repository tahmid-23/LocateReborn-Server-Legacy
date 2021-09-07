const { spawn } = require("child_process");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const app = express();

app.set("etag", false);
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`), (request, response, next) => {
  response.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.set("Pragma", "no-cache");
  response.set("Expires", "0");
  response.set("Surrogate-Control", "no-store");

  if (request.url == "/login/") {
    if (request.cookies["locate-bca-password"] == process.env.BCA_PASSWORD) {
      response.redirect("/");
    } else {
      next();
    }
  } else if (
    request.cookies["locate-bca-password"] != process.env.BCA_PASSWORD &&
    request.method != "POST" &&
    !request.url.includes("login.js") &&
    !request.url.includes("styles.css") &&
    !request.url.includes("monocle_cat.png")
  ) {
    response.redirect("/login/");
  } else {
    next();
  }
});
app.use("/student/:id", express.static(`${__dirname}/public`));
app.use("/course/:id", express.static(`${__dirname}/public`));
app.use(
  "/bugs",
  express.static(`${__dirname}/public`),
  express.static(`${__dirname}/bugs`),
  bodyParser.text({ type: "text/plain" })
);
app.use(
  "/login",
  express.static(`${__dirname}/public`),
  bodyParser.text({ type: "text/plain" })
);

app.get("/student/:id", (request, response) => {
  display(response, ["student", request.params.id]);

  if (request.params.id) {
    fs.readFile(`${__dirname}/moral/popularity.json`, (err, data) => {
      if (!err) {
        let json = JSON.parse(data);
        json[request.params.id] = json[request.params.id] || 0;
        json[request.params.id]++;

        fs.writeFile(
          `${__dirname}/moral/popularity.json`,
          JSON.stringify(json, null, 2),
          err => {}
        );
      }
    });
  }
});

app.get("/course/:id", (request, response) => {
  display(response, ["course", request.params.id]);
});

app.post("/bugs/bug.html", (request, response) => {
  if (request.body) {
    fs.readFile(`${__dirname}/bugs/buglist.json`, (err, data) => {
      if (!err) {
        let json = JSON.parse(data);
        json.push({
          date: new Date().toGMTString(),
          description: request.body,
          status: "Unresolved"
        });

        fs.writeFile(
          `${__dirname}/bugs/buglist.json`,
          JSON.stringify(json, null, 2),
          err => {}
        );
      }
    });
  }

  response.status(204).send();
});

app.post("/login", (request, response) => {
  if (request.body == process.env.BCA_PASSWORD) {
    response.status(204);
    response.cookie("locate-bca-password", process.env.BCA_PASSWORD, {
      httpOnly: true,
      secure: true
    });
  } else {
    response.status(403);
  }
  response.send();
});

app.get("/login", (request, response) => {
  response.sendFile(`${__dirname}/public/login.html`);
});

app.get("/", (request, response) => {
  display(response, "main");
});

app.all("*", (request, response) => {
  response.redirect(303, "/");
});

app.listen(process.env.PORT);

function display(response, args) {
  const process = spawn("python3", ["script.py"].concat(args), {
    cwd: `${__dirname}/generator`
  });

  let message = "";
  process.stdout.on("data", data => {
    if (data.toString() != "\n") {
      message += data.toString();
    }
  });

  process.stderr.on("data", data => {
    message = data.toString();
  });

  process.stdout.on("close", () => {
    response.send(message);
  });
}
