exports.textCheck = (textOnlyField) => {
  return /[^a-zA-Z_]/g.test(textOnlyField);
};

exports.bodyCheck = (textOnlyField) => {
  return /[^a-zA-Z_\s\,\.\!\"\;\?\@\£\&]/g.test(textOnlyField);
};

exports.onlyPositiveIntegers = (param) => {
  return /\D/g.test(param) || param < 1;
};

exports.calculatePage = (p, limit, rowCount) => {
  if (+p === 1 || +limit > rowCount) {
    page = 0;
  } else if (+p === 2) {
    page = +limit;
  } else if (+p > 2) {
    page = +limit * +p;
  }
};
