import { z } from "zod";
import { sse } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/lib/server/api/trpc";
// import { completion } from "@/lib/ai/completion";
import { AICompletionRequest } from "@/lib/validtions/ai";
// import { BrowserbaseLoader } from "langchain/tools/web/browser";

export const mainRouter = createTRPCRouter({
  //   completion: publicProcedure
  //     .input(AICompletionRequest)
  // .subscription(completion),

  browser: publicProcedure.query(async () => {
    return {
      userAgent: navigator.userAgent,
    };
  }),
});
