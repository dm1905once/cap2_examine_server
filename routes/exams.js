/** Routes for Exams. */

const express = require("express");
const router = new express.Router();
const Exam = require('../db_ops/Exam');


router.get("/", async function (req, res, next) {
    res.send("<h1>Exams</h1>");
});

router.post("/", async function (req, res, next) {
    try{
        const newExam = await Exam.create(req.body.newExam);
        return res.status(201).json(newExam);
    }
    catch (err) {
        return next(err);
    }
});

  module.exports = router;