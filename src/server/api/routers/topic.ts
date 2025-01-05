import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// ctx = context
export const topicRouter = createTRPCRouter({
  // gets all topics from the userID, which is gained through sessions as opposed to input.

  // the tutorial I was following had ctx.prisma.topic.findMany, BUT typescript was telling me that "prisma" didn't exist as a type. After some digging in the trpc.ts file, I found out that db was used instead of prisma and changed it accordingly. It seems like it may have solved my problem.

  // CONFIRMATION: It did, in fact, solve my problem!! YAY!!!
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.topic.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.topic.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      });
    }),
});
