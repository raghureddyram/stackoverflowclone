const { PrismaClient } = require('@prisma/client');
const data = require('./data.json');  // Assuming you saved the JSON to a file called data.json

const prisma = new PrismaClient();

async function main() {
  for (const item of data) {
    // Upsert the user who asked the question
    const user = await prisma.user.upsert({
      where: { id: item.user.id },
      update: {},
      create: {
        id: item.user.id,
        name: item.user.name,
      },
    });

    // Insert the question
    const question = await prisma.question.create({
      data: {
        title: item.title,
        body: item.body,
        createdAt: new Date(item.creation * 1000), // Convert from Unix timestamp
        score: item.score,
        userId: user.id,  // Use userId instead of `connect`
      },
    });

    // Insert comments for the question
    for (const comment of item.comments) {
      const commentUser = await prisma.user.upsert({
        where: { id: comment.user.id },
        update: {},
        create: {
          id: comment.user.id,
          name: comment.user.name,
        },
      });

      await prisma.comment.create({
        data: {
          body: comment.body,
          createdAt: new Date(), // Use current time for simplicity
          userId: commentUser.id, // Use userId instead of connect
          questionId: question.id,  // Use questionId instead of connect
        },
      });
    }

    // Insert answers for the question
    for (const answer of item.answers) {
      const answerUser = await prisma.user.upsert({
        where: { id: answer.user.id },
        update: {},
        create: {
          id: answer.user.id,
          name: answer.user.name,
        },
      });

      const createdAnswer = await prisma.answer.create({
        data: {
          body: answer.body,
          createdAt: new Date(answer.creation * 1000),
          score: answer.score,
          userId: answerUser.id, // Use userId instead of connect
          questionId: question.id,  // Use questionId instead of connect
        },
      });

      // Insert comments for the answer
      if (answer.comments) {
        for (const comment of answer.comments) {
          const commentUser = await prisma.user.upsert({
            where: { id: comment.user.id },
            update: {},
            create: {
              id: comment.user.id,
              name: comment.user.name,
            },
          });

          await prisma.comment.create({
            data: {
              body: comment.body,
              createdAt: new Date(), // Use current time for simplicity
              userId: commentUser.id,  // Use userId instead of connect
              answerId: createdAnswer.id,  // Use answerId instead of connect
            },
          });
        }
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
