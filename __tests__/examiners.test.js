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

afterAll(async function(){

    const deleteTestExam = async ()=>{
        await prisma.exams.delete({ where: { "exam_id": "E_kh26test" } });
    }
    
    const deleteTestExaminer = async ()=>{
        await prisma.examiners.delete({ where: { "username": "unitTest" } });
    }

    deleteTestExam().then(deleteTestExaminer);
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
    });

    test("Create a new exam", async function(){
        const response = await request(app)
        .post("/examiners/unitTest/exams")
        .send(
            {
                  exam_id: 'E_kh26test',
                  exam_name: 'Unit Test exam',
                  exam_description: 'This exam was created by an automated test script',
                  exam_owner: 'unitTest',
                  exam_pass_score: 70,
                  exam_fee: 99,
                  questions: [
                    {
                      question_id: 'Q_kh26dfjt',
                      question_type: 'BIN',
                      question_text: 'First question',
                      question_seq: 1,
                      choices: [
                        {
                          choice_id: 'kh26a9v1',
                          choice_text: 'True'
                        },
                        {
                          choice_id: 'kh26a9v2',
                          choice_text: 'False'
                        }
                      ],
                      valid_answer_id: 'kh26a9v1'
                    },
                    {
                      question_id: 'Q_kh26dzmy',
                      question_type: 'MCQ',
                      question_text: 'Second question',
                      question_seq: 2,
                      choices: [
                        {
                          choice_id: 'kh26dqaz',
                          choice_text: 'op1'
                        },
                        {
                          choice_id: 'kh26dxf8',
                          choice_text: 'op2'
                        }
                      ],
                      valid_answer_id: 'kh26dxf8'
                    }
                  ],
                _token: token
              }
        );
        expect(response.statusCode).toEqual(201);
        expect(response.body.exam_id).toEqual('E_kh26test');
    });


    test("Update an existing exam", async function(){
        const response = await request(app)
        .patch("/examiners/unitTest/exams")
        .send(
            {
                  exam_id: 'E_kh26test',
                  exam_name: 'Unit Test exam',
                  exam_description: 'This exam was created by an automated test script',
                  exam_owner: 'unitTest',
                  exam_pass_score: 70,
                  exam_fee: 99,
                  questions: [
                    {
                      question_id: 'Q_kh26dfjt',
                      question_type: 'BIN',
                      question_text: 'First question',
                      question_seq: 1,
                      choices: [
                        {
                          choice_id: 'kh26a9v1',
                          choice_text: 'True'
                        },
                        {
                          choice_id: 'kh26a9v2',
                          choice_text: 'False'
                        }
                      ],
                      valid_answer_id: 'kh26a9v2'
                    },
                    {
                      question_id: 'Q_kh26dzmy',
                      question_type: 'MCQ',
                      question_text: 'Second question',
                      question_seq: 2,
                      choices: [
                        {
                          choice_id: 'kh26dqaz',
                          choice_text: 'op1'
                        },
                        {
                          choice_id: 'kh26dxf8',
                          choice_text: 'op2'
                        }
                      ],
                      valid_answer_id: 'kh26dqaz'
                    }
                  ],
                _token: token
            }
        );
        expect(response.statusCode).toEqual(201);
        expect(response.body.exam_id).toEqual('E_kh26test');
    });


    test("(Soft) delete an exam", async function(){
        const response = await request(app)
        .delete("/examiners/unitTest/exams")
        .send(
            {
                exam_id: 'E_kh26test',
                _token: token
            }
        );
        expect(response.statusCode).toEqual(204);
    });


});