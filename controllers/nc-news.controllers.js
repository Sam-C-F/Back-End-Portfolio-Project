const { fetchTopics, addTopic } = require("../models/topics.models");
const endpoints = require("../endpoints.json");

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await fetchTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.postTopic = async (req, res, next) => {
  try {
    const { description, slug } = req.body;
    const topic = await addTopic(description, slug);
    res.status(201).send({ topic });
  } catch (err) {
    next(err);
  }
};
