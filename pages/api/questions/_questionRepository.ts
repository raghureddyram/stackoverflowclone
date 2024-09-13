import prisma from '../../../lib/prisma';

export async function findQuestionById(id: number) {
    return await prisma.question.findUnique({
        where: { id },
        include: { 
            user: true, 
            answers: true 
        },
    });
}

export async function updateQuestion(id: number,  userId: number,  title?: string, body?: string, score?: number) {
    return await prisma.question.update({
        where: { id },
        data: {
            title,
            body,
            userId,
            score,
        },
    });
}

export async function deleteQuestion(id: number): Promise<void> {
    await prisma.question.delete({
        where: { id },
    });
}

export async function findAllActiveUserQuestions() {
    return await prisma.question.findMany({
        where: {
            user: {
                archivedAt: null,  // Only get questions where the user's archivedAt is null
            },
        },
        include: {
            user: { 
                select: { id: true, name: true }
            },
            comments: {
                include: {
                    user: { 
                        select: { id: true, name: true, archivedAt: true }
                    }
                }
            },
            answers: {
                include: {
                    user: { 
                        select: { id: true, name: true, archivedAt: true }
                    }
                }
            }
        },
    });
}


export async function createQuestion(title: string, body: string, userId: number) {
    return await prisma.question.create({
        data: {
            title,
            body,
            userId,
        },
    });
}