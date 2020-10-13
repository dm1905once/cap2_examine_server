const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

/** return signed JWT from user data. */

function createExaminerToken(user) {
  let payload = {
    username: user.username,
    org_handle: user.organizations.handle,
    org_name: user.organizations.name,
    org_logo: user.organizations.logo_url,
    role: 'examiner'
  };

  return jwt.sign(payload, SECRET);
}

function createApplicantToken(user) {
  let payload = {
    email: user.email,
    role: 'applicant'
  };

  return jwt.sign(payload, SECRET);
}


module.exports = {
  createExaminerToken,
  createApplicantToken
};