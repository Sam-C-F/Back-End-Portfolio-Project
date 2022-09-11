exports.postgressErrors = (err, req, res, next) => {
  const badRequestErrors = [
    "22P02",
    "42703",
    "42601",
    "25001",
    "2BP01",
    "2201W",
  ];
  if (badRequestErrors.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.serverErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal server error");
};
