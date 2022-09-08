const express = require("express");
const {
  postgressErrors,
  customErrors,
  serverErrors,
} = require("./controllers/error-handling.controller");

const apiRouter = require("./routes/api.router");

const app = express();
app.use("/", express.static("public"));
app.use(express.json());

app.use("/api", apiRouter);

app.use(postgressErrors);

app.use(customErrors);

app.use(serverErrors);

module.exports = app;
