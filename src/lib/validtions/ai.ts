import { z } from "zod";

export const AICompletionRequest = z.object({
  prompt: z.string(),
});

export type AICompletionInputType = z.infer<typeof AICompletionRequest>;