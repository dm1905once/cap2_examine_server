/** Routes for Applicants. */

const express = require("express");
const router = new express.Router();


router.get("/", async function (req, res, next) {
    res.send("<h1>Applicants</h1>");
});

  module.exports = router;