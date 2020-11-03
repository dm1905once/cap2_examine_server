const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

class Exam {

    static async getAll(){
        const exams = await prisma.exams.findMany();
        return exams;
    };

    static async getUserExams(username){
        const exams = await prisma.exams.findMany({
            where: {
                exam_owner: username,
                exam_status: 'enabled'
            },
        });
        return exams;
    };

    static async getExamForEdit(username, examId){
        const exam = await prisma.exams.findOne({
            where: { exam_id: examId },
            include: {
                questions: {
                    include: {
                        choices: {
                            select: {
                                choice_id: true,
                                choice_text: true
                            }
                        }
                    }
                }
            }
        });
        return exam;
    }

    static async getExamForPurchase(exam_id){
        const exam = await prisma.exams.findOne({
            where: { exam_id }
        });
        return exam;
    }

    static async getExamForApplying(exam_id){
        const exam = await prisma.exams.findOne({
            where: { exam_id },
            select: {
                exam_id: true,
                exam_name: true,
                questions: {
                    select : {
                        question_id: true,
                        question_text: true,
                        choices: {
                            select: {
                                choice_id: true,
                                choice_text: true
                            }
                        }
                    }
                }
            }
        });
        return exam;
    }

    static async getExamForEvaluation(exam_id){
        const exam = await prisma.exams.findOne({
            where: { exam_id },
            select: {
                exam_name: true,
                questions: {
                    select : {
                        question_id: true,
                        valid_answer_id: true
                    }
                }
            }
        });
        return exam;
    }

    static async deleteUserExam(username, exam_id){
        const exam = await prisma.exams.delete({
            where: { exam_id }
        });
        return exam;
    };

    static async markDeletedUserExam(username, exam_id){
        const exam = await prisma.exams.update({
            where: { exam_id },
            data: { exam_status: 'deleted' }
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
                exam_status: 'enabled',
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
                        valid_answer_id: question.valid_answer_id,
                        exams: {
                            connect: { exam_id: newExamId.exam_id}
                        },
                        choices: {
                            create: [...question.choices]
                        }
                    },
                    select: { question_id: true}
                });
            });
        } 
        return newExamId;
    };


    static async getApplicableExams(){
        const exams = await prisma.exams.findMany({
            where: {
                exam_status: 'enabled'
            },
            include: {
                examiners: {
                    select: {
                        photo_url: true,
                        organizations: {
                            select: {
                                name: true,
                                logo_url: true
                            }
                        }
                    }
                }
            }
        });
        return exams;
    };

    static async preValidateExam(application_id, applicant_email){
        const exam = await prisma.applications.findOne({
            where: { application_id },
            select: {
                applicant_email: true,
                exam_id: true
            }
        });

        if (exam.applicant_email === applicant_email) {
            return exam.exam_id;
        } else  {
            return null
        };
    }

}

module.exports = Exam;