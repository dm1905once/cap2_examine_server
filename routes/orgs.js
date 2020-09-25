/** Routes for Organizations. */

const express = require("express");
const router = new express.Router();


router.get("/", async function (req, res, next) {
    try {
      return res.json({AllOrgs: [{name: "org1"}, {name: "org2"}]});
    }
    catch (err) {
      return next(err);
    }
  });

  module.exports = router;