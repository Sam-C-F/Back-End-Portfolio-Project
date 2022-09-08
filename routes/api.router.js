const express = require("express");
const {
  getApi,
  getTopics,
  deleteCommentById,
} = require("../controllers/nc-news.controllers");
const articlesRouter = require("./articles.router");
const usersRouter = require("./users.router");

const apiRouter = express.Router();

apiRouter.get("/", getApi);

apiRouter.get("/topics", getTopics);

apiRouter.use("/articles", articlesRouter);

apiRouter.delete("/comments/:comment_id", deleteCommentById);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
