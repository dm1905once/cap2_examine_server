/* Routes for:  /examiners   */

const express = require("express");
const bcrypt = require("bcryptjs");
const router = new express.Router();
const { createExaminerToken } = require('../helpers/createToken');
const { authRequired, ensureCorrectUser } = require("../middleware/auth");
const Examiner = require('../db_ops/Examiner');
const Exam = require('../db_ops/Exam');

const BCRYPT_WORK_FACTOR = 10;

// GET all examiners (this is not used just yet)
router.get("/", async function (req, res, next) {
    try {
        const allExaminers = await Examiner.getAll();
        res.json(allExaminers);
    }
    catch (err) {
        return next(err);
    }
});


router.get("/:username", authRequired, ensureCorrectUser, async function (req, res, next) {
    try {
        const examiner = await Examiner.getOne(req.params.username);
        res.json(examiner);
    }
    catch (err) {
        return next(err);
    }
});

// GET all exams for an examiner
router.get("/:username/exams", authRequired, ensureCorrectUser, async function (req, res, next) {
    const username = req.params.username;
    try{
        const exams = await Exam.getUserExams(username);
        return res.status(200).json(exams);
    }
    catch (err) {
        return next(err);
    }
});

// GET one exam so it can be editted
router.get("/:username/exams/:examId", authRequired, ensureCorrectUser, async function (req, res, next) {
    const { username, examId } = req.params;
    try{
        const exam = await Exam.getExamForEdit(username, examId);
        return res.status(200).json(exam);
    }
    catch (err) {
        return next(err);
    }
});

// POST a new exam
router.post("/:username/exams", authRequired, ensureCorrectUser, async function (req, res, next) {
    try{
        const newExam = await Exam.create(req.body);
        return res.status(201).json(newExam);
    }
    catch (err) {
        return next(err);
    }
});


// PATCH update an existing exam
router.patch("/:username/exams", authRequired, ensureCorrectUser, async function (req, res, next) {
    try{
        const { exam_owner, exam_id } = req.body;
        const oldExamDeleted = await Exam.deleteUserExam(exam_owner, exam_id);
        if (oldExamDeleted) {
            const replacementExam = await Exam.create(req.body);
            return res.status(201).json(replacementExam);
        };
        
    }
    catch (err) {
        return next(err);
    }
});

// DELETE an exam
router.delete("/:username/exams", authRequired, ensureCorrectUser, async function (req, res, next) {
    const username = req.params.username;
    const examId = req.body.exam_id;
    try{
        const examDeleted = await Exam.deleteUserExam(username, examId);
        return res.status(204).end();
    }
    catch (err) {
        return next(err);
    }
});


// POST register a new examiner
router.post("/register", async function (req, res, next) {
    const { username,  password } = req.body;
    try{
        if (await Examiner.exists(username)) {
            const err = new Error(`username '${username} already exists`);
            err.status = 409; throw err;
        } else {
            const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
            const newExaminer = await Examiner.register(req.body, hashedPassword);
            const token = createExaminerToken(newExaminer);
            return res.status(201).json({ token });
        }
    } 
    catch (err) {
        return next(err);
    }
});

// POST login a new examiner
router.post("/login", async function (req, res, next) {
    const { username, password } = req.body;
    try {
        const result = await Examiner.authenticate(username);
        const examiner = result;
        if (examiner) {
            const isValid = await bcrypt.compare(password, examiner.password);
            if (isValid) {
                const token = createExaminerToken(examiner);
                return res.status(200).json({ token });
            }
        }

        const invalidPass = new Error("Invalid Credentials");
        invalidPass.status = 401;
        throw invalidPass;

    } 
    catch (err) {
        return next(err);
    }
});

module.exports = router;