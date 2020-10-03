const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const morgan = require("morgan");
app.use(morgan("tiny"));


// Routes
const orgsRoutes = require("./routes/orgs");
const examinersRoutes = require("./routes/examiners");
const examsRoutes = require("./routes/exams");
const applicantsRoutes = require("./routes/applicants");

app.use("/orgs", orgsRoutes);
app.use("/examiners", examinersRoutes);
app.use("/exams", examsRoutes);
app.use("/applicants", applicantsRoutes);



// Error handling
app.use(function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    return next(err);
  });
  
app.use(function (err, req, res, next) {
    if (err.stack) console.log(err.stack);
    res.status(err.status || 500);
    return res.json({
        error: err,
        message: err.message
    });
});


module.exports = app;