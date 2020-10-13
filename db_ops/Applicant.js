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
}

module.exports = Applicant;