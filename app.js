const express = require("express");
const cors = require("cors");
const {
  postgressErrors,
  customErrors,
  serverErrors,
} = require("./controllers/error-handling.controller");

const app = express();
app.use(cors());
const apiRouter = require("./routes/api.router");

app.use("/", express.static("public"));
app.use(express.json());

app.use("/api", apiRouter);

app.use(postgressErrors);

app.use(customErrors);

app.use(serverErrors);

module.exports = app;
