const db = require("../db/connection");

const { textCheck } = require("./utility-funcs.models");

exports.fetchUsers = async () => {
  const allUsers = await db.query(
    `
        SELECT * FROM users
        `
  );
  return allUsers.rows;
};

exports.fetchUserByUsername = async (username) => {
  if (textCheck(username)) {
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
