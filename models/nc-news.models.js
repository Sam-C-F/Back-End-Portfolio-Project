const db = require("../db/connection");
const endpoints = require("../endpoints.json");

exports.fetchTopics = async () => {
  const topicQuery = await db.query(
    `
    SELECT * FROM topics
    `
  );
  return topicQuery.rows;
};

exports.fetchArticles = async (
  articleId,
  topicQuery,
  sortBy = "created_at",
  orderBy = "DESC"
) => {
  const validColumns = [
    "topic",
    "articles",
    "votes",
    "comment_count",
    "created_at",
    "title",
  ];
  const validOrder = ["ASC", "DESC"];
  if (!validColumns.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (!validOrder.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const topicsData = await db.query(`SELECT * FROM topics`);
  if (topicQuery) {
    const activeTopics = topicsData.rows.map((row) => {
      return row.slug;
    });
    if (!activeTopics.includes(topicQuery)) {
      return Promise.reject({
        status: 404,
        msg: `${topicQuery} not found`,
      });
    }
  }
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
      ORDER BY ${sortBy} ${orderBy};`;

  const fullQuery = await db.query(queryStr, queryValues);

  if (fullQuery.rows.length === 0 && !topicQuery) {
    return Promise.reject({ status: 404, msg: "not found" });
  } else if (fullQuery.rows.length === 0 && topicQuery) {
    return fullQuery.rows;
  } else if (fullQuery.rows.length === 1) {
    return fullQuery.rows[0];
  } else {
    return fullQuery.rows;
  }
};

exports.fetchUsers = async () => {
  const allUsers = await db.query(
    `
      SELECT * FROM users
      `
  );

  return allUsers.rows;
};

exports.updateArticles = async (articleId, newVotes) => {
  const checkArticleData = await db.query(
    `
    SELECT votes FROM articles
    WHERE article_id = $1;
    `,
    [articleId]
  );

  if (checkArticleData.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  const votes = checkArticleData.rows[0].votes + newVotes;
  const updateArticleData = await db.query(
    `
      UPDATE articles
      SET votes = $1
      WHERE article_id = $2
      RETURNING *
      `,
    [votes, articleId]
  );

  return updateArticleData.rows[0];
};

exports.fetchCommentsOnArticle = async (articleId) => {
  if (articleId.match(/\D/g) || articleId < 1) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const activeArticleIds = await db.query(
    `
  SELECT * FROM articles
  `
  );

  const activeArticleIdsArray = activeArticleIds.rows.map((row) => {
    return row.article_id;
  });
  if (!activeArticleIdsArray.includes(+articleId)) {
    return Promise.reject({
      status: 404,
      msg: `article id ${articleId} not found`,
    });
  }

  const activeComments = await db.query(
    `
  SELECT * FROM comments 
  WHERE article_id = $1;
  `,
    [articleId]
  );
  return activeComments.rows;
};

exports.addCommentsOnArticle = async (article_id, username, body) => {
  if (article_id.match(/\D/g) || article_id < 1) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (body === undefined || username === undefined) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const activeUsersAndIds = await db.query(
    `
  SELECT * FROM users
  JOIN articles ON articles.author = users.username;
  `
  );
  const activeArticleIds = activeUsersAndIds.rows.map((row) => {
    return row.article_id;
  });
  const activeUsernames = activeUsersAndIds.rows.map((row) => {
    return row.username;
  });
  if (
    !body ||
    !activeUsernames.includes(username) ||
    !activeArticleIds.includes(+article_id)
  ) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  const timeStamp = new Date(Date.now());
  const postComment = await db.query(
    `
  INSERT INTO comments
  (votes, body, author, article_id, created_at)
  VALUES
  ('0', $1, $2, $3, $4)
  RETURNING *;
  `,
    [body, username, article_id, timeStamp]
  );

  return postComment.rows[0];
};

exports.removeCommentById = async (commentId) => {
  if (commentId.match(/\D/g) || commentId < 1) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const activeArticleIds = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [commentId]
  );

  if (!activeArticleIds.rows[0]) {
    return Promise.reject({ status: 404, msg: "not found" });
  }

  const deleteComment = await db.query(
    `
  DELETE FROM comments
  WHERE comment_id = $1;
  `,
    [commentId]
  );
  return deleteComment;
};

exports.fetchApi = () => {
  return endpoints;
};

exports.fetchUserByUsername = async (username) => {
  if (username.match(/[^a-zA-Z_]/g)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const userData = await db.query(
    `
  SELECT * FROM users 
  WHERE username = $1;
  `,
    [username]
  );
  if (!userData.rows[0]) {
    return Promise.reject({ status: 404, msg: `${username} not found` });
  } else {
    return userData.rows[0];
  }
};
