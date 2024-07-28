import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
} from "ai/rsc";
import { AIMessage } from "../types";
import type { AI } from "../providers/ai-state";
import { CoreMessage, ToolResultPart, generateId } from "ai";
import { Spinner } from "@/components/ui/spinner";
import { Section } from "@/components/ai/chat/section";
import { ErrorCard } from "@/components/ai/chat/error-card";
import { researcher } from "./agents/researcher";
import { writer } from "./agents/writer";
import { querySuggestor } from "./agents/query-suggestor";
import { imageAttributes } from "./agents/image-attributes";

export async function pipeline(
  formData?: FormData,
  skip?: boolean,
  retryMessages?: AIMessage[]
) {
  "use server";
  const aiState = getMutableAIState<typeof AI>();
  const uiStream = createStreamableUI();
  const isGenerating = createStreamableValue(true);
  const isCollapsed = createStreamableValue(false);
  const aiMessages = [...(retryMessages ?? aiState.get().messages)];

  // Get the messages from the state, filter out the tool messages
  const messages: CoreMessage[] = aiMessages
    .filter(
      (message) =>
        message.role !== "tool" &&
        message.type !== "followup" &&
        message.type !== "related" &&
        message.type !== "end"
    )
    .map((message) => {
      const { role, content } = message;
      return { role, content } as CoreMessage;
    });

  const groupId = generateId(); // groupId is used to group the messages for collapse
  const maxMessages = 5; // Limit the number of messages to the maximum
  messages.splice(0, Math.max(messages.length - maxMessages, 0));

  // Get the user input from the form data
  const userInput = skip
    ? `{"action": "skip"}`
    : (formData?.get("image") as string);

  const content = skip
    ? userInput
    : formData
      ? JSON.stringify(Object.fromEntries(formData))
      : null;
  const type = skip
    ? undefined
    : formData?.has("image")
      ? "input"
      : formData?.has("related_query")
        ? "input_related"
        : "inquiry";

  // Add the user message to the state
  if (content) {
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: generateId(),
          role: "user",
          content,
          type,
        },
      ],
    });
    messages.push({
      role: "user",
      content,
    });
  }

  const imgString = formData?.get("image") as string;

  async function processEvents() {
    uiStream.append(<Spinner />); // Show the spinner
    // isCollapsed.done(true); // Set the collapsed state to true
    //  Generate the answer
    let answer = "";
    let stopReason = "";
    let toolOutputs: ToolResultPart[] = [];
    let errorOccurred = false;
    const streamText = createStreamableValue<string>();
    uiStream.update(<div />);
    while (toolOutputs.length === 0 && answer.length === 0 && !errorOccurred) {
      // Get image attributes
      try {
        console.log("FormData:", JSON.stringify(formData));
        console.log("ImgString:", imgString);
        const attributes = await imageAttributes(imgString);
        console.log(attributes);
        messages.push({
          role: "assistant",
          content: JSON.stringify(attributes),
        });
      } catch (error) {
        console.error("Error getting image attributes:", error);
        // errorOccurred = true;
        break;
      }
      // Generate query
      try {
        const query = await querySuggestor(messages);
        console.log(query);
        messages.push({
          role: "assistant",
          content: JSON.stringify(query),
        });
      } catch (error) {
        console.error("Error generating query:", error);
        // errorOccurred = true;
        break;
      }
      // Search the web and generate the answer
      const { fullResponse, hasError, toolResponses, finishReason } =
        await researcher(uiStream, streamText, messages);
      stopReason = finishReason || "";
      answer = fullResponse;
      toolOutputs = toolResponses;
      errorOccurred = hasError;

      if (toolOutputs.length > 0) {
        toolOutputs.map((output) => {
          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: groupId,
                role: "tool",
                content: JSON.stringify(output.result),
                name: output.toolName,
                type: "tool",
              },
            ],
          });
        });
      }
    }

    if (answer.length === 0 && !errorOccurred) {
      const { response, hasError } = await writer(uiStream, messages);
      answer = response;
      errorOccurred = hasError;
      messages.push({
        role: "assistant",
        content: answer,
      });
    }
    if (!errorOccurred) {
      streamText.done();
      aiState.update({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: groupId,
            role: "assistant",
            content: answer,
            type: "answer",
          },
        ],
      });
    } else {
      aiState.done(aiState.get());
      streamText.done();
      uiStream.append(
        <ErrorCard
          errorMessage={answer || "An error occurred. Please try again."}
        />
      );
    }
    isGenerating.done(false);
    uiStream.done();
  }

  processEvents();

  return {
    id: generateId(),
    isGenerating: isGenerating.value,
    component: uiStream.value,
    isCollapsed: isCollapsed.value,
  };
}
