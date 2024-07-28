import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamObject } from "ai";
import { PartialRelated, relatedSchema } from "@/lib/schemas/related";
import { models, GPT_MINI } from "../models";
import { queryGenerationSystemPrompt } from "../prompts";

export async function querySuggestor(messages: CoreMessage[]) {
  const objectStream = createStreamableValue<PartialRelated>();

  const lastMessages = messages.slice(-1).map((message) => {
    return {
      ...message,
      role: "user",
    };
  }) as CoreMessage[];

  let finalRelatedQueries: PartialRelated = {};

  await streamObject({
    model: models.languageModel(GPT_MINI),
    system: queryGenerationSystemPrompt,
    messages: lastMessages,
    schema: relatedSchema,
  })
    .then(async (result) => {
      for await (const obj of result.partialObjectStream) {
        if (obj.items) {
          objectStream.update(obj);
          finalRelatedQueries = obj;
        }
      }
    })
    .finally(() => {
      objectStream.done();
    });

  return finalRelatedQueries;
}
