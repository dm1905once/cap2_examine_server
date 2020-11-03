const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

beforeAll(async function(){
    const org1Exists = await prisma.organizations.count({where: {handle: 'ORG1'}});

    // Create default Organization if it doesn't exist
    if (org1Exists !== 1) {
        const org1 = await prisma.organizations.create({
            data: {
                handle: 'ORG1',
                key: 'org1',
                name: 'SOME STATE UNIVERSITY',
                logo_url: 'sangga-rima-roman-selia-lSwbzenbmIw-unsplash.jpg'
            },
            select: { handle: true }
        });
    };
});

describe("Examiner Tests", function() {
    let token;

    test("Create a new examiner", async function(){
        const response = await request(app)
        .post("/examiners/register")
        .send(
            {
                "username": "unitTest",
                "email": "test@nada.com",
                "first_name": "Unit",
                "last_name": "Test",
                "password": "qwer",
                "org_handle": "ORG1",
                "photo_url": "https://placeimg.com/640/480/business"
            }
        );
        expect(response.statusCode).toEqual(201);
        token = response.body.token;
        console.log("Token is", token);
    })


});