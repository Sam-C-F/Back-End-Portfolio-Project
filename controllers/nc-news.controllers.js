const articles = require("../db/data/test-data/articles");
const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  updateArticles,
} = require("../models/nc-news.models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const topicQuery = req.query.topic;
  const articleId = req.params.article_id;
  fetchArticles(articleId, topicQuery)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.patchArticles = (req, res, next) => {
  const newVotes = req.body.inc_votes;
  const articleId = req.params.article_id;
  updateArticles(articleId, newVotes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
