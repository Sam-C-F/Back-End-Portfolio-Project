const express = require("express");
const {
  getApi,
  getTopics,
  deleteCommentById,
  getUsers,
  getUserByUsername,
} = require("../controllers/nc-news.controllers");
const articlesRouter = require("./articles.router.js");

const apiRouter = express.Router();

apiRouter.get("/", getApi);

apiRouter.get("/topics", getTopics);

apiRouter.use("/articles", articlesRouter);

apiRouter.delete("/comments/:comment_id", deleteCommentById);

apiRouter.get("/users", getUsers);

module.exports = apiRouter;
