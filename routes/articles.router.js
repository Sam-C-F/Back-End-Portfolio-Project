const express = require("express");
const {
  getArticles,
  patchArticles,
  getCommentsOnArticle,
  postCommentsOnArticle,
  postArticles,
} = require("../controllers/nc-news.controllers");
const articlesRouter = express.Router();

articlesRouter.route("/").get(getArticles).post(postArticles);

articlesRouter.route("/:article_id").get(getArticles).patch(patchArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsOnArticle)
  .post(postCommentsOnArticle);

module.exports = articlesRouter;
