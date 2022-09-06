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

exports.fetchArticles = (articleId, topicQuery) => {
  let queryStr = `
  SELECT articles.article_id, articles.title, users.name AS author, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comment_count
  FROM articles
  JOIN users ON articles.author = users.username
  LEFT JOIN comments ON comments.article_id = articles.article_id`;

  const queryValues = [];

  if (articleId) {
    queryStr += ` WHERE articles.article_id = $1`;
    queryValues.push(articleId);
  }

  if (topicQuery) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topicQuery);
  }

  queryStr += ` GROUP BY articles.article_id, users.name 
  ORDER BY created_at DESC;`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    console.log(rows);
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "not found" });
    } else if (rows.length === 1) {
      return rows[0];
    } else {
      return rows;
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

exports.updateArticles = (articleId, newVotes) => {
  return db
    .query(
      `
    SELECT votes FROM articles
    WHERE article_id = $1;
    `,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      const votes = rows[0].votes + newVotes;
      return db.query(
        `
      UPDATE articles
      SET votes = $1
      WHERE article_id = $2
      RETURNING *
      `,
        [votes, articleId]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
