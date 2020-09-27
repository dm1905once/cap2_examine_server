/* Routes for:  /examiners   */

const express = require("express");
const bcrypt = require("bcryptjs");
const createToken = require('../helpers/createToken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = new express.Router();

const BCRYPT_WORK_FACTOR = 10;

router.get("/", async function (req, res, next) {
    try {
        const allExaminers = await prisma.examiners.findMany();
        res.json(allExaminers);
    }
    catch (err) {
        return next(err);
    }
});

router.post("/register", async function (req, res, next) {
    const { username, email, first_name, last_name, password, org_handle, photo_url} = req.body;
    try{
        const duplicateUsername = await prisma.examiners.count({
            where: {username: username}
        });

        if (duplicateUsername > 0 ) {
            const err = new Error(`username '${username} already exists`);
            err.status = 409; throw err;
        } else {
            const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
            const newExaminer = await prisma.examiners.create({ 
                data: {
                    username, 
                    email, 
                    first_name, 
                    last_name, 
                    password: hashedPassword, 
                    photo_url,
                    organizations: {
                        connect: { handle: org_handle}
                    }
                }
            });
            delete newExaminer.password;
            const token = createToken(newExaminer, 'examiner');
            return res.status(201).json({ token });
        }
    } 
    catch (err) {
        return next(err);
    }
});

  module.exports = router;