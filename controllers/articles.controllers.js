const {
  fetchArticles,
  updateArticles,
  addArticle,
  fetchCommentsOnArticle,
  addCommentsOnArticle,
  removeArticleById,
} = require("../models/articles.models");

exports.getArticles = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;
    let { sort_by, order_by, topic, limit, p } = req.query;
    const { rows, rowCount } = await fetchArticles(
      articleId,
      topic,
      p,
      sort_by,
      order_by,
      limit
    );
    res.status(200).send({ articles: rows, total_count: rowCount });
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

exports.postArticles = async (req, res, next) => {
  try {
    const { author, title, body, topic } = req.body;
    const article = await addArticle(author, title, body, topic);
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsOnArticle = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;
    const { limit, p } = req.query;
    const comments = await fetchCommentsOnArticle(articleId, limit, p);
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

exports.deleteArticleByID = async (req, res, next) => {
  try {
    const articleId = req.params.article_id;
    await removeArticleById(articleId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
