/* Routes for:  /orgs   */

const express = require("express");
const router = new express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { authRequired, ensureCorrectUser } = require("../middleware/auth");


router.get("/", async function (req, res, next) {
    try {
      const allOrgs = await prisma.organizations.findMany();
      res.json(allOrgs);
    }
    catch (err) {
      return next(err);
    }
  });

  router.get("/validateKeyHandle", async function (req, res, next) {
      try {
        const orgIsValid = await prisma.organizations.count({
          where: { 
            handle: req.query.handle,
            key: req.query.key
          }
        });
        res.json(`{orgIsValid: ${orgIsValid > 0}}`);
      }
      catch (err) {
        return next(err);
      }
    });

router.get("/:handle", async function (req, res, next) {
    try {
      const org = await prisma.organizations.findOne({
        where: { handle: req.params.handle }
      });
      res.json(org);
    }
    catch (err) {
      return next(err);
    }
  });


  module.exports = router;