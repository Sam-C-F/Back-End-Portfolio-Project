const articles = require("../db/data/test-data/articles");
const { fetchTopics, fetchArticles } = require("../models/nc-news.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticles(articleId)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
