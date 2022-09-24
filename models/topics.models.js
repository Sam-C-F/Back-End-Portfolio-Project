const db = require("../db/connection");
const { textCheck } = require("./utility-funcs.models");

exports.fetchTopics = async () => {
  const topicQuery = await db.query(
    `
      SELECT * FROM topics
      `
  );
  return topicQuery.rows;
};

exports.addTopic = async (description, slug) => {
  if (textCheck(description) || textCheck(slug) || !description || !slug) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const postTopic = await db.query(
    `
  INSERT INTO topics 
  (description, slug)
  VALUES 
  ($1, $2)
  RETURNING *;
  `,
    [description, slug]
  );
  return postTopic.rows[0];
};
