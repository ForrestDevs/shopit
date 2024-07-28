import { createOpenAI } from "@ai-sdk/openai";
import { experimental_createProviderRegistry as createProviderRegistry } from "ai";
import { env } from "../env";

export const GPT_TURBO = "openai:gpt-3.5-turbo";
export const GPT_MINI = "openai:gpt-4o-mini";

export const models = createProviderRegistry({
  // register provider with prefix and custom setup:
  openai: createOpenAI({
    apiKey: env.OPENAI_API_KEY,
  }),
});
