import { createStreamableValue } from "ai/rsc";
import { streamObject } from "ai";
import { models, GPT_MINI } from "../models";
import { visionSystemPrompt } from "../prompts";
import {
  PartialInquiry,
  imageAttributeSchema,
} from "@/lib/schemas/image-attributes";

export async function imageAttributes(img: string) {
  const objectStream = createStreamableValue<PartialInquiry>();
  let finalInquiry: PartialInquiry = {};

  await streamObject({
    model: models.languageModel(GPT_MINI),
    system: visionSystemPrompt,
    maxTokens: 500000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: img,
          },
        ],
      },
    ],
    schema: imageAttributeSchema,
  })
    .then(async (result) => {
      for await (const obj of result.partialObjectStream) {
        if (obj) {
          objectStream.update(obj);
          finalInquiry = obj;
        }
      }
    })
    .finally(() => {
      objectStream.done();
    });

  return finalInquiry;
}
