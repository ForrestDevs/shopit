import { tool } from "ai";
import { createStreamableValue } from "ai/rsc";
import { searchSchema } from "@/lib/schemas/search";
import { SearchSection } from "@/components/ai/search/search-section";
import { ToolProps } from ".";
import { env } from "@/lib/env";

export const searchTool = ({ uiStream, fullResponse }: ToolProps) =>
  tool({
    description: "Search the web for information",
    parameters: searchSchema,
    execute: async ({
      query,
      max_results,
      search_depth,
      include_domains,
      exclude_domains,
    }) => {
      let hasError = false;
      // Append the search section
      const streamResults = createStreamableValue<string>();
      uiStream.update(
        <SearchSection
          result={streamResults.value}
          includeDomains={include_domains}
        />
      );

      const filledQuery =
        query.length < 5 ? query + " ".repeat(5 - query.length) : query;
      let results;
      try {
        results = await tavilySearch(
          filledQuery,
          max_results,
          search_depth,
          include_domains,
          exclude_domains
        );
      } catch (error) {
        console.error("Search API error:", error);
        hasError = true;
      }

      if (hasError) {
        fullResponse = `An error occurred while searching for "${query}.`;
        uiStream.update(null);
        streamResults.done();
        return results;
      }

      streamResults.done(JSON.stringify(results));

      return results;
    },
  });

async function tavilySearch(
  query: string,
  maxResults: number = 10,
  searchDepth: "basic" | "advanced" = "basic",
  includeDomains: string[] = [],
  excludeDomains: string[] = []
): Promise<any> {
  const apiKey = env.TAVILY_API_KEY;
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults < 5 ? 5 : maxResults,
      search_depth: searchDepth,
      include_images: true,
      include_answers: true,
      include_domains: includeDomains,
      exclude_domains: excludeDomains,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
