/** Routes for Applicants. */

const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const { createApplicantToken } = require('../helpers/createToken');
const { authRequired, ensureCorrectUser } = require("../middleware/auth");
const Applicant = require('../db_ops/Applicant');
const Exam = require('../db_ops/Exam');
const { CLIENT_REDIRECT_URL, STRIPE_SECRET } = require('../config');
const stripe = require('stripe')(STRIPE_SECRET);

const BCRYPT_WORK_FACTOR = 10;

// GET LIST OF ALL EXAMS
router.get("/exams", async function (req, res, next) {
  try {
    const allExams = await Exam.getApplicableExams();
    res.json(allExams);
  }
  catch (err) {
      return next(err);
  }
});

// GET list of PURCHASED exams
router.get("/:applicantEmail/purchased", async function (req, res, next) {
  try {
    const purchased = await Applicant.getPurchasedExams(req.params.applicantEmail);
    res.json(purchased);
  }
  catch (err) {
      return next(err);
  }
});

// GET list of COMPLETED exams
router.get("/:applicantEmail/completed", async function (req, res, next) {
  try {
    const completed = await Applicant.getCompletedExams(req.params.applicantEmail);
    res.json(completed);
  }
  catch (err) {
      return next(err);
  }
});

// POST acquireExam - register a new application
router.post("/acquireExam", async function (req, res, next) {
  const { ...applicationDetails} = req.body;
  try{
        const newApplication = await Applicant.acquireExam(applicationDetails);
        return res.status(201).json({ newApplication });
  } 
  catch (err) {
      return next(err);
  }
});

// GET validateApplication - validate that requested exam is valid
router.get("/validateApplication", async function (req, res, next) {
  const { application_id, applicant_email } = req.query;
  try {
    const validExamId = await Exam.preValidateExam(application_id, applicant_email);
    return res.json({ validExamId });
  } catch (err) {
    return next(err);
}
})

// GET applyExam - retrieve exam to be applied
router.get("/applyExam", async function (req, res, next) {
  const { exam_id } = req.query;
  try {
    const exam = await Exam.getExamForApplying(exam_id);
    return res.json({ exam });
  } catch (err) {
    return next(err);
}
});


// POST submitExam - applicant submits an active exam
router.post("/submitExam", async function (req, res, next) {
  const { exam_id, responses: applicantResponses } = req.body;
  try{
      const validResponses = await Exam.getExamForEvaluation(exam_id);
        // const examScore = await Applicant.submitExam(examResponses);
        // return res.status(201).json({ examScore });
        let goodAnswers=0;
        applicantResponses.forEach(appResponse =>{
          if (validResponses.questions.find(valResponse =>{
            return valResponse['valid_answer_id'] === appResponse['selected_choice_id']})){
              goodAnswers++;
          }
        });
        const score = (Math.round(goodAnswers/validResponses.questions.length * 100)).toFixed(2);
  } catch (err) {
      return next(err);
  }
});



// POST (Stripe) create-session 
router.post('/stripe/create-session', async (req, res, next) => {
  const { exam_id, application_id, applicant_email, org_logo } = req.body;

  try{
    const examDetails = await Exam.getExamForPurchase(exam_id);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: examDetails.exam_name,
              images: [org_logo],
            },
            unit_amount: parseInt(examDetails.exam_fee),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${CLIENT_REDIRECT_URL}/applicants?success=true&application_id=${application_id}&exam_id=${exam_id}&applicant_email=${applicant_email}`,
      cancel_url: `${CLIENT_REDIRECT_URL}/applicants?canceled=true`,
    });

    return res.json({ id: session.id });

  }catch (err) {
    return next(err);
  }
});


// POST register a new applicant
router.post("/register", async function (req, res, next) {
  const { email, password } = req.body;
  try{
      if (await Applicant.exists(email)) {
          const err = new Error(`Email address '${email} is already registered`);
          err.status = 409; throw err;
      } else {
          const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
          const newApplicant = await Applicant.register(req.body, hashedPassword);
          const token = createApplicantToken(newApplicant);
          return res.status(201).json({ token });
      }
  } 
  catch (err) {
      return next(err);
  }
});

// POST login a new applicant
router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;
  try {
      const result = await Applicant.authenticate(email);
      const applicant = result;
      if (applicant) {
          const isValid = await bcrypt.compare(password, applicant.password);
          if (isValid) {
              const token = createApplicantToken(applicant);
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