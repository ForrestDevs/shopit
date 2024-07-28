import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { AnswerSection } from "@/components/ai/answer/answer-section";
import { GPT_MINI, models } from "../models";
import { writerSystemPrompt } from "../prompts";

export async function writer(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[]
) {
  let fullResponse = "";
  let hasError = false;
  const streamableAnswer = createStreamableValue<string>("");
  const answerSection = <AnswerSection result={streamableAnswer.value} />;
  uiStream.append(answerSection);

  await streamText({
    model: models.languageModel(GPT_MINI),
    maxTokens: 2500,
    system: writerSystemPrompt,
    messages,
    onFinish: (event) => {
      fullResponse = event.text;
      streamableAnswer.done(event.text);
    },
  })
    .then(async (result) => {
      for await (const text of result.textStream) {
        if (text) {
          fullResponse += text;
          streamableAnswer.update(fullResponse);
        }
      }
    })
    .catch((err) => {
      hasError = true;
      fullResponse = "Error: " + err.message;
      streamableAnswer.update(fullResponse);
    });

  return { response: fullResponse, hasError };
}
