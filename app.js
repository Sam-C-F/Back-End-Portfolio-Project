const express = require("express");
const { getTopics } = require("./controllers/nc-news.controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal server error");
});

module.exports = app;
