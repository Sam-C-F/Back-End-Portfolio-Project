const express = require("express");
const {
  getApi,
  getTopics,
  postTopic,
} = require("../controllers/nc-news.controllers");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const usersRouter = require("./users.router");
const apiRouter = express.Router();

apiRouter.get("/", getApi);

apiRouter.get("/topics", getTopics);
apiRouter.post("/topics", postTopic);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
