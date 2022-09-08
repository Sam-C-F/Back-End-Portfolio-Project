const express = require("express");
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/nc-news.controllers");
const usersRouter = express.Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
