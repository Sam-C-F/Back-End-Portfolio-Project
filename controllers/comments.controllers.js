const {
  removeCommentById,
  updateCommentsById,
} = require("../models/comments.models");

exports.deleteCommentById = async (req, res, next) => {
  try {
    await removeCommentById(req.params.comment_id);
    res.status(204).send();
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
