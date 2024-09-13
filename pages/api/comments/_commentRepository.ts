import prisma from '../../../lib/prisma';

// Find all comments where the user's archivedAt is null
export async function findAllActiveUserComments() {
    return await prisma.comment.findMany({
        where: {
            user: {
                archivedAt: null,  // Ensure the comment's user is not archived
            },
        },
        include: {
            user: {
                select: { id: true, name: true }
            },
            question: {
                include: {
                    user: {
                        select: { id: true, name: true, archivedAt: true }  // Include the question's user info including if archived
                    }
                }
            },
            answer: {
                include: {
                    user: {
                        select: { id: true, name: true, archivedAt: true }  // Include the answer's user info including if archived
                    }
                }
            },
        },
    });
}



export async function createComment(body: string, userId: number, questionId?: number, answerId?: number) {
    return await prisma.comment.create({
        data: {
            body,
            userId,
            questionId,
            answerId,
        },
    });
}

export async function findCommentWithQuestionAndAnswer(id: string) {
    return await prisma.comment.findUnique({
        where: { id: Number(id) },
        include: {
            user: { select: { id: true, name: true } }, 
            question: {
                include: {
                    user: { select: { id: true, name: true, archivedAt: true } },  
                }
            },
            answer: {
                include: {
                    user: { select: { id: true, name: true, archivedAt: true } }, 
                }
            }
        }
    });
}


export async function updateComment(id: string, userId: number, body?: string, questionId?: number, answerId?: number) {
    return await prisma.comment.update({
        where: { id: Number(id), userId },
        data: {
            body,
            userId,
            questionId,
            answerId,
        },
    });
}


export async function deleteComment(id: string): Promise<void> {
    await prisma.comment.delete({
        where: { id: Number(id) },
    });
    return
}
