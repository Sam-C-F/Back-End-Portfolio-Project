const db = require("../db/connection");
const { onlyPositiveIntegers } = require("./utility-funcs.models");

exports.removeCommentById = async (commentId) => {
  if (onlyPositiveIntegers(commentId)) {
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

exports.updateCommentsById = async (commentId, newVotes) => {
  const checkCommentData = await db.query(
    `
        SELECT votes FROM comments
        WHERE comment_id = $1;
        `,
    [commentId]
  );
  if (checkCommentData.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  const votes = checkCommentData.rows[0].votes + newVotes;
  const updatecommentData = await db.query(
    `
          UPDATE comments
          SET votes = $1
          WHERE comment_id = $2
          RETURNING *
          `,
    [votes, commentId]
  );
  return updatecommentData.rows[0];
};
