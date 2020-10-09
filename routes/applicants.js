/** Routes for Applicants. */

const express = require("express");
const router = new express.Router();
const { authRequired, ensureCorrectUser } = require("../middleware/auth");
const Exam = require('../db_ops/Exam');


router.get("/exams", async function (req, res, next) {
  try {
    const allExams = await Exam.getApplicableExams();
    res.json(allExams);
  }
  catch (err) {
      return next(err);
  }
});

  module.exports = router;