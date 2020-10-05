const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Exam {

    static async getAll(){
        const exams = await prisma.exams.findMany();
        return exams;
    };

    static async getUserExams(username){
        const exams = await prisma.exams.findMany({
            where: {exam_owner: username},
        });
        return exams;
    };

    static async getExamForEdit(username, examId){
        const exam = await prisma.exams.findOne({
            where: { exam_id: examId },
            include: {
                questions: {
                    include: {
                        choices: true
                    }
                }
            }
        });
        return exam;
    }

    static async deleteUserExam(username, exam_id){
        const exam = await prisma.exams.delete({
            where: {exam_id},
        });
        return exam;
    };

    static async create(exam){
        const newExamId = await prisma.exams.create({
            data: {
                exam_id: exam.exam_id,
                exam_name: exam.exam_name,
                exam_description: exam.exam_description,
                exam_fee: exam.exam_fee,
                exam_pass_score: exam.exam_pass_score,
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