import { createAI, createStreamableValue, getAIState } from "ai/rsc";
import { AIState, Chat, UIState } from "@/lib/types";
import { generateId } from "ai";
import { SearchSection } from "@/components/ai/search/search-section";
import { pipeline } from "../ai/pipeline";
import { UserMessage } from "@/components/ai/chat/user-message";
import { AnswerSection } from "@/components/ai/answer/answer-section";
import RetrieveSection from "@/components/ai/search/retrieve-section";

const initialAIState: AIState = {
  chatId: generateId(),
  messages: [],
};

const initialUIState: UIState = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI<AIState, UIState>({
  actions: {
    pipeline: pipeline,
  },
  initialUIState,
  initialAIState,
  onGetUIState: async () => {
    "use server";

    const aiState = getAIState();
    if (aiState) {
      const uiState = getUIStateFromAIState(aiState as Chat);
      return uiState;
    } else {
      return;
    }
  },
  onSetAIState: async ({ state, done }) => {
    "use server";

    // Check if there is any message of type 'answer' in the state messages
    if (!state.messages.some((e) => e.type === "answer")) {
      return;
    }

    console.log("AI State", JSON.stringify(state.messages));

    done = true;
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  const chatId = aiState.chatId;
  const isSharePage = aiState.isSharePage;
  return aiState.messages
    .map((message, index) => {
      const { role, content, id, type, name } = message;

      if (
        !type ||
        type === "end" ||
        (isSharePage && type === "related") ||
        (isSharePage && type === "followup")
      )
        return null;

      switch (role) {
        case "user":
          switch (type) {
            case "input":
            case "input_related":
              const json = JSON.parse(content);
              const value = type === "input" ? json.input : json.related_query;
              return {
                id,
                component: (
                  <UserMessage
                    message={value}
                    chatId={chatId}
                    showShare={index === 0 && !isSharePage}
                  />
                ),
              };
          }
        case "assistant":
          const answer = createStreamableValue();
          answer.done(content);
          switch (type) {
            case "answer":
              return {
                id,
                component: <AnswerSection result={answer.value} />,
              };
          }
        case "tool":
          try {
            const toolOutput = JSON.parse(content);
            const isCollapsed = createStreamableValue();
            isCollapsed.done(true);
            const searchResults = createStreamableValue();
            searchResults.done(JSON.stringify(toolOutput));
            switch (name) {
              case "search":
                return {
                  id,
                  component: <SearchSection result={searchResults.value} />,
                  isCollapsed: isCollapsed.value,
                };
              case "retrieve":
                return {
                  id,
                  component: <RetrieveSection data={toolOutput} />,
                  isCollapsed: isCollapsed.value,
                };
            }
          } catch (error) {
            return {
              id,
              component: null,
            };
          }
        default:
          return {
            id,
            component: null,
          };
      }
    })
    .filter((message) => message !== null) as UIState;
};
