const db = require("../db/connection");

exports.fetchTopics = () => {
  return db
    .query(
      `
    SELECT * FROM topics
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticles = (articleId) => {
  return db
    .query(
      `
    SELECT articles.article_id, title, users.name AS author, body, topic, created_at, votes FROM articles
    JOIN users ON articles.author = users.username
    WHERE article_id = $1;
    `,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        return rows[0];
      }
    });
};

exports.fetchUsers = () => {
  return db
    .query(
      `
      SELECT * FROM users
      `
    )
    .then(({ rows }) => {
      return rows;
    });
};
