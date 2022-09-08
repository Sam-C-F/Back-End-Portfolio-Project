const express = require("express");
const {
  getArticles,
  patchArticles,
  getCommentsOnArticle,
  postCommentsOnArticle,
} = require("../controllers/nc-news.controllers");
const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticles);
articlesRouter.patch("/:article_id", patchArticles);
articlesRouter.get("/:article_id/comments", getCommentsOnArticle);
articlesRouter.post("/:article_id/comments", postCommentsOnArticle);

module.exports = articlesRouter;
