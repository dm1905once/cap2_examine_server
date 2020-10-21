const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

class Applicant {

    static async exists(email){
        const usernameCount = await prisma.applicants.count({
            where: {email: email}
        });
        return (usernameCount>0)? true: false;
    }

    static async register(formData, hashedPassword){
        const { email, full_name} = formData;
        const newApplicant = await prisma.applicants.create({ 
            data: {
                email, 
                full_name, 
                password: hashedPassword
            },
            select : {
                email: true
            }
        });
        return newApplicant;
    }

    static async authenticate(email){
        const result = await prisma.applicants.findOne({ 
            where: { email },
            select : {
                email: true,
                password: true,
                full_name: true
            }
        });
        return result;
    }

    static async acquireExam(applicationDetails){
        const { application_id, applicant_email, exam_id } = applicationDetails;
        const result = await prisma.applications.create({ 
            data: {
                application_id,
                status: "purchased",
                applicants : {
                    connect: { email: applicant_email }
                },
                exams : {
                    connect: { exam_id }
                }
            },
            select : {
                status: true
            }
        });
        return result;
    }

    static async updateExamResults(examResults){
        const { application_id, questions_total, questions_correct, questions_unanswered, eval_pct } = examResults;
        const result = await prisma.applications.update({ 
            where: { application_id },
            data: {
                status: 'completed',
                questions_total,
                questions_correct,
                questions_unanswered,
                eval_pct
            },
            select : {
                eval_pct: true
            }
        });
        return result;
    }

    static async getPurchasedExams(applicant_email){
        const result = await prisma.applications.findMany({ 
            where: { 
                applicant_email,
                status: 'purchased' 
            },
            include : {
                exams: {
                    select : {
                        exam_name: true,
                        exam_pass_score: true
                    }
                }
            }
        });
        return result;
    }

    static async getCompletedExams(applicant_email){
        const result = await prisma.applications.findMany({ 
            where: { 
                applicant_email,
                status: 'completed' 
            },
            include : {
                exams: {
                    select : {
                        exam_name: true,
                        exam_pass_score: true
                    }
                }
            }
        });
        return result;
    }
}

module.exports = Applicant;