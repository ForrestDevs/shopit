import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { CoreMessage, ToolCallPart, ToolResultPart, streamText } from "ai";
import { AnswerSection } from "@/components/ai/answer/answer-section";
import { getTools } from "@/lib/ai/tools";
import { GPT_MINI, models } from "../models";
import { researcherSystemPrompt } from "../prompts";

export async function researcher(
  uiStream: ReturnType<typeof createStreamableUI>,
  streamableText: ReturnType<typeof createStreamableValue<string>>,
  messages: CoreMessage[]
) {
  let fullResponse = "";
  let hasError = false;
  let finishReason = "";

  const streambleAnswer = createStreamableValue<string>("");
  const answerSection = <AnswerSection result={streambleAnswer.value} />;

  const result = await streamText({
    model: models.languageModel(GPT_MINI),
    maxTokens: 2500,
    system: researcherSystemPrompt,
    messages: messages,
    tools: getTools({
      uiStream,
      fullResponse,
    }),
    onFinish: async (event) => {
      finishReason = event.finishReason;
      fullResponse = event.text;
      streambleAnswer.done();
    },
  }).catch((err) => {
    hasError = true;
    fullResponse = "Error: " + err.message;
    streamableText.update(fullResponse);
  });

  // If the result is not available, return an error response
  if (!result) {
    return { result, fullResponse, hasError, toolResponses: [] };
  }

  const hasToolResult = messages.some((message) => message.role === "tool");
  if (hasToolResult) {
    uiStream.append(answerSection);
  }

  // Process the response
  const toolCalls: ToolCallPart[] = [];
  const toolResponses: ToolResultPart[] = [];

  for await (const delta of result.fullStream) {
    switch (delta.type) {
      case "text-delta":
        if (delta.textDelta) {
          fullResponse += delta.textDelta;
          streambleAnswer.update(fullResponse);
        }
        break;
      case "tool-call":
        toolCalls.push(delta);
        break;
      case "tool-result":
        if (!delta.result) {
          hasError = true;
        }
        toolResponses.push(delta);
        break;
      case "error":
        console.log("Error: " + delta.error);
        hasError = true;
        fullResponse += `\nError occurred while executing the tool`;
        break;
    }
  }
  messages.push({
    role: "assistant",
    content: [{ type: "text", text: fullResponse }, ...toolCalls],
  });

  if (toolResponses.length > 0) {
    // Add tool responses to the messages
    messages.push({ role: "tool", content: toolResponses });
  }

  return { result, fullResponse, hasError, toolResponses, finishReason };
}
