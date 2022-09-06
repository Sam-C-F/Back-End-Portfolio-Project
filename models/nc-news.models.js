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
  return db
    .query(`SELECT * FROM topics`)
    .then(({ rows }) => {
      if (topicQuery) {
        const activeTopics = rows.map((row) => {
          return row.slug;
        });
        if (!activeTopics.includes(topicQuery)) {
          return Promise.reject({
            status: 404,
            msg: `${topicQuery} not found`,
          });
        }
      }
    })
    .then(() => {
      let queryStr = `
      SELECT articles.article_id, articles.title, articles.author,`;

      if (articleId) {
        queryStr += `articles.body,`;
      }

      queryStr += ` articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id)::INT AS comment_count
      FROM articles
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

      queryStr += ` GROUP BY articles.article_id 
      ORDER BY created_at DESC;`;

      return db.query(queryStr, queryValues);
    })
    .then(({ rows }) => {
      if (rows.length === 0 && !topicQuery) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else if (rows.length === 0 && topicQuery) {
        return rows;
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

exports.fetchCommentsOnArticle = (articleId) => {
  if (articleId.match(/\D/g)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(
      `
  SELECT * FROM articles
  `
    )
    .then(({ rows }) => {
      const activeArticleIds = rows.map((row) => {
        return row.article_id;
      });
      if (!activeArticleIds.includes(+articleId)) {
        return Promise.reject({
          status: 404,
          msg: `article id ${articleId} not found`,
        });
      }
    })
    .then(() => {
      return db.query(
        `
  SELECT * FROM comments 
  WHERE article_id = $1;
  `,
        [articleId]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};
