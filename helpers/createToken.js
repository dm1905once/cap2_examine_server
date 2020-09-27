const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

/** return signed JWT from user data. */

function createToken(user, role) {
  let payload = {
    username: user.username,
    org_handle: user.org_handle,
    role
  };

  return jwt.sign(payload, SECRET);
}


module.exports = createToken;