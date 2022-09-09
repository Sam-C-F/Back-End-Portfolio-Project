const {
  fetchTopics,
  fetchArticles,
  fetchUsers,
  updateArticles,
  fetchCommentsOnArticle,
  addCommentsOnArticle,
  fetchApi,
  removeCommentById,
  fetchUserByUsername,
  updateCommentsById,
  addArticle,
} = require("../models/nc-news.models");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
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
    const articles = await fetchArticles(
      articleId,
      topicQuery,
      sortBy,
      orderBy
    );
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.patchArticles = async (req, res, next) => {
  try {
    const newVotes = req.body.inc_votes;
    const articleId = req.params.article_id;
    const article = await updateArticles(articleId, newVotes);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsOnArticle = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;
    const comments = await fetchCommentsOnArticle(articleId);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentsOnArticle = async (req, res, next) => {
  try {
    const { username, body } = req.body;
    const articleId = req.params.article_id;
    const comment = await addCommentsOnArticle(articleId, username, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    await removeCommentById(req.params.comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.getApi = (req, res, next) => {
  const endpoints = fetchApi();
  res.status(200).send({ endpoints });
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await fetchUserByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.patchCommentsById = async (req, res, next) => {
  try {
    const newVotes = req.body.inc_votes;
    const commmentId = req.params.comment_id;
    const comment = await updateCommentsById(commmentId, newVotes);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.postArticles = async (req, res, next) => {
  try {
    const { author, title, body, topic } = req.body;
    const article = await addArticle(author, title, body, topic);
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};
