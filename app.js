const express = require("express");
const {
  getTopics,
  getArticles,
  getUsers,
  patchArticles,
  getCommentsOnArticle,
  postCommentsOnArticle,
  getApi,
  deleteCommentById,
} = require("./controllers/nc-news.controllers");

const app = express();
app.use(express.static("public"));
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticles);
app.patch("/api/articles/:article_id", patchArticles);
app.get("/api/articles/:article_id/comments", getCommentsOnArticle);
app.post("/api/articles/:article_id/comments", postCommentsOnArticle);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getUsers);

app.use((err, req, res, next) => {
  const badRequestErrors = ["22P02", "42703", "42601", "25001", "2BP01"];
  if (badRequestErrors.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

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
