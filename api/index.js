const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ws = require("ws");
const jwtKey = process.env.JWT_KEY;
const Messasge = require("./models/message");
const userRoutes = require("./Routes/User-Routes");
const httpError = require("./Middleware/http-error");

const fs = require("fs");
const app = express();

app.use((req, res, next) => {
  console.log("hit");
  // console.log(req.url);
  next();
});
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(bodyParser.json());
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use("/api/profile", userRoutes);
app.use("/api/messages", userRoutes);
app.use("/api/all", userRoutes);
app.use("/api", userRoutes);

app.use((req, res, next) => {
  const error = new httpError("Route Not Found", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (error && error.message) {
    console.log(error.message);
  } else {
    console.log("An error occurred (no error message provided).");
  }

  res.status(500).json({ error: error.message });
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Not Connected to Server because: ");
    console.log(err);
  });
const server = app.listen(4000);

const wss = new ws.WebSocketServer({ server });
wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
    [
      [...wss.clients].forEach((c) => {
        c.send(
          JSON.stringify({
            online: [...wss.clients].map((cl) => ({
              userId: cl.userId,
              username: cl.username,
            })),
          })
        );
      }),
    ];
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearTimeout(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
    }, 1000);
  }, 5000);
  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookiesString = cookies
      .split(";")
      .find((str) => str.startsWith("token="));
    if (tokenCookiesString) {
      const token = tokenCookiesString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtKey, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }
  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    try {
      if (text.length === 0) {
        throw "";
      }
    } catch (error) {
      return;
    }
    let filename = null;
    if (file) {
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + "/uploads/" + filename;
      const bufferData = new Buffer.from(file.data.split(",")[1], "base64");
      fs.writeFile(path, bufferData, () => {
        console.log("file saved at " + path);
      });
    }

    if ((recipient && text) || file) {
      const messageDoc = await Messasge.create({
        sender: connection.userId,
        text,
        recipient,
        file: file ? filename : null,
      });
      [...wss.clients]
        .filter((c) => c.userId === recipient && c !== connection)
        .forEach((c) => {
          console.log(c.userId);
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient,
              file: file ? filename : null,
              _id: messageDoc._id,
            })
          );
        });
    }
  });
  //Notifing People when someone connects
  notifyAboutOnlinePeople();
});
