const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  updateArticles,
  fetchCommentsOnArticle,
  addCommentsOnArticle,
  fetchApi,
  removeCommentById,
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
  let sortBy = req.query.sort_by;
  if (sortBy) {
    sortBy = sortBy.toLowerCase();
  }
  let orderBy = req.query.order_by;
  if (orderBy) {
    orderBy = orderBy.toUpperCase();
  }
  fetchArticles(articleId, topicQuery, sortBy, orderBy)
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

exports.getCommentsOnArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchCommentsOnArticle(articleId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentsOnArticle = (req, res, next) => {
  const { username, body } = req.body;
  const articleId = req.params.article_id;
  addCommentsOnArticle(articleId, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params.comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getApi = (req, res, next) => {
  const endpoints = fetchApi();
  res.status(200).send({ endpoints });
};
