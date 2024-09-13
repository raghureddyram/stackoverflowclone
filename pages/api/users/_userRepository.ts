import prisma from '../../../lib/prisma';

export async function findAllActiveUsers() {
    return await prisma.user.findMany({
        where: { archivedAt: null },
        include: {
            questions: true,
            answers: true,
            comments: true
        },
    });
}


export async function createUser(name: string) {
    return await prisma.user.create({
        data: {
            name,
        },
    });
}


// Find a user by their id where archivedAt is null
export async function findActiveUserById(id: number) {
    return await prisma.user.findUnique({
        where: { id, archivedAt: null },
        include: {
            questions: true,
            answers: true,
            comments: true,
        },
    });
}


export async function updateUser(id: number, name: string) {
    return await prisma.user.update({
        where: { id },
        data: { name },
    });
}

// Soft delete a user by setting archivedAt
export async function softDeleteUser(id: number) {
    return await prisma.user.update({
        where: { id },
        data: { archivedAt: new Date() },
    });
}
