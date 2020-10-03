const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Exam {

    static async getAll(){
        const exams = await prisma.exams.findMany();
        return exams;
    };

    static async create(exam){
        const newExamId = await prisma.exams.create({
            data: {
                exam_id: exam.exam_id,
                exam_name: exam.exam_name,
                exam_fee: exam.exam_fee,
                exam_pass_pct: exam.exam_pass_pct,
                examiners: {
                    connect: { username: exam.exam_owner}
                }
            },
            select: {exam_id: true}
        });

        if (newExamId){
            exam.questions.map(async question =>{
                await prisma.questions.create({
                    data: {
                        question_id: question.question_id,
                        question_type: question.question_type,
                        question_text: question.question_text,
                        question_seq: question.question_seq,
                        valid_answer_id: question.valid_answer,
                        exams: {
                            connect: { exam_id: newExamId.exam_id}
                        },
                        choices: {
                            create: [...question.options]
                        }
                    },
                    select: { question_id: true}
                });
            });
        } 
        return newExamId;
    }

}

module.exports = Exam;