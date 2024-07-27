// import { ChatOpenAI } from "@langchain/openai";
// import { LangChainAdapter, StreamingTextResponse } from "ai";
// import { StringOutputParser } from "@langchain/core/output_parsers";
// import type { AICompletionInputType } from "@/lib/validtions/ai";
// import { api } from "../trpc/server";

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function* completion({ input }: { input: AICompletionInputType }) {
//   const { prompt } = input;

//   const model = new ChatOpenAI({
//     model: "gpt-3.5-turbo-0125",
//     temperature: 0,
//   });

//   const parser = new StringOutputParser();

//   const stream = await model.pipe(parser).

//   function* timeout() {
//     yield new Promise((resolve) => setTimeout(resolve, maxDuration * 1000));
//   }
//   yield* timeout(new StreamingTextResponse(LangChainAdapter.toAIStream(stream)));
// }

// export function useCompletion() {
//   const foo = await api.main.completion

  
// }
