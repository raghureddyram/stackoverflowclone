import prisma from '../../../lib/prisma';

export async function findAnswerWithQuestion(id: string){
    const answer = await prisma.answer.findUnique({
        where: { id: Number(id), user: {archivedAt: null} }, 
        include: { question: true, user: { select: {id: true, name: true}}, 
        comments: { include: {user: {select: {id: true, name: true, archivedAt: true}}}}},
      });
    return answer;
}

export async function updateAnswer(id: string, body: string, userId: number, questionId: number, score?: number, accepted?: boolean){
    const updatedAnswer = await prisma.answer.update({
        where: {
            id: Number(id),
        },
        data: {
            body,
            userId,
            questionId,
            score,
            accepted
        },
    });
    return updatedAnswer;
}

export async function deleteAnswer(id: string): Promise<void>{
    await prisma.answer.delete({
        where: { id: Number(id) },
    });
    return
}

export async function findAllAnswersForActiveUserQuestions() {
    return await prisma.answer.findMany({
        where: {
            user: {
                archivedAt: null, // Ensure the answer's user is not archived
            },
            question: {
                user: {
                    archivedAt: null,  // Ensure the question's user is not archived
                }
            }
        },
        include: { 
            user: { 
                select: { id: true, name: true } 
            },
            question: {
                include: {
                    user: { 
                        select: { id: true, name: true } 
                    }
                }
            }, 
            comments: {
                include: {
                    user: { 
                        select: { id: true, name: true, archivedAt: true }
                    },
                },
            }
        },
    });
}



export async function createAnswer(body: string, userId: number, questionId: number, accepted?: boolean) {
    return await prisma.answer.create({
        data: {
            body,
            userId,
            questionId,
            accepted: !!accepted
        },
    });
}
