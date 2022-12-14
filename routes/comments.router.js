const express = require("express");
const {
  patchCommentsById,
  deleteCommentById,
} = require("../controllers/comments.controllers");
const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", patchCommentsById);

module.exports = commentsRouter;
