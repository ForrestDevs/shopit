import { tool } from "ai";
import { retrieveSchema } from "@/lib/schemas/retrieve";
import { ToolProps } from ".";
import { SearchSkeleton } from "@/components/ai/search/search-skeleton";
import { SearchResults as SearchResultsType } from "@/lib/types";
import RetrieveSection from "@/components/ai/search/retrieve-section";

export const retrieveTool = ({ uiStream, fullResponse }: ToolProps) =>
  tool({
    description: "Retrieve content from the web",
    parameters: retrieveSchema,
    execute: async ({ url }) => {
      let hasError = false;
      // Append the search section
      uiStream.append(<SearchSkeleton />);

      let results: SearchResultsType | undefined;
      try {
        const response = await fetch(`https://r.jina.ai/${url}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-With-Generated-Alt": "true",
          },
        });
        const json = await response.json();
        if (!json.data || json.data.length === 0) {
          hasError = true;
        } else {
          // Limit the content to 5000 characters
          if (json.data.content.length > 5000) {
            json.data.content = json.data.content.slice(0, 5000);
          }
          results = {
            results: [
              {
                title: json.data.title,
                content: json.data.content,
                url: json.data.url,
              },
            ],
            query: "",
            images: [],
          };
        }
      } catch (error) {
        console.error("Retrieve API error:", error);
        hasError = true;
      }

      if (hasError || !results) {
        fullResponse = `An error occurred while retrieving "${url}".`;
        uiStream.update(null);
        return results;
      }

      uiStream.update(<RetrieveSection data={results} />);

      return results;
    },
  });
