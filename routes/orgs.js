/* Routes for:  /orgs   */

const express = require("express");
const router = new express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.get("/", async function (req, res, next) {
    try {
      const allOrgs = await prisma.organizations.findMany();
      res.json(allOrgs);
    }
    catch (err) {
      return next(err);
    }
  });

  module.exports = router;