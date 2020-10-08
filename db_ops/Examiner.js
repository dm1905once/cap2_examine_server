const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

class Examiner {

    static async getAll(){
        const examiners = await prisma.examiners.findMany();
        return examiners;
    }

    static async getOne(username){
        const examiner = await prisma.examiners.findOne({
            where: {username: username},
            select : {
                username: true,
                first_name: true,
                last_name: true,
                email: true,
                organizations: {
                    select :{
                        name: true,
                        handle: true,
                        logo_url: true
                    }
                }
            }
        });
        return examiner;
    }

    static async exists(username){
        const usernameCount = await prisma.examiners.count({
            where: {username: username}
        });
        return (usernameCount>0)? true: false;
    }

    static async register(formData, hashedPassword){
        const { username, email, first_name, last_name, org_handle, photo_url} = formData;
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
            },
            select : {
                username: true,
                organizations: {
                    select :{
                        name: true,
                        handle: true,
                        logo_url: true
                    }
                }
            }
        });
        return newExaminer;
    }

    static async authenticate(username){
        const result = await prisma.examiners.findOne({ 
            where: { username },
            select : {
                username: true,
                password: true,
                organizations: {
                    select :{
                        name: true,
                        handle: true,
                        logo_url: true
                    }
                }
            }
        });
        return result;
    }
}

module.exports = Examiner;