const db = require("../db/connection");

exports.fetchTopics = async () => {
  const topicQuery = await db.query(
    `
      SELECT * FROM topics
      `
  );
  return topicQuery.rows;
};
