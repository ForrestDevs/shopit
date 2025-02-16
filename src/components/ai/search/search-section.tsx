"use client";

import { SearchResults } from "./search-results";
import { SearchSkeleton } from "./search-skeleton";
import { SearchResultsImageSection } from "./search-results-image";
import { Section } from "@/components/ai/chat/section";
import { ToolBadge } from "@/components/ai/search/tool-badge";
import type { SearchResults as TypeSearchResults } from "@/lib/types";
import { StreamableValue, useStreamableValue } from "ai/rsc";

export type SearchSectionProps = {
  result?: StreamableValue<string>;
  includeDomains?: string[];
};

export function SearchSection({ result, includeDomains }: SearchSectionProps) {
  const [data, error, pending] = useStreamableValue(result);
  const searchResults: TypeSearchResults = data ? JSON.parse(data) : undefined;
  const includeDomainsString = includeDomains
    ? ` [${includeDomains.join(", ")}]`
    : "";
  return (
    <div>
      {!pending && data ? (
        <>
          <Section size="sm" className="pt-2 pb-0">
            <ToolBadge tool="search">{`${searchResults.query}${includeDomainsString}`}</ToolBadge>
          </Section>
          {searchResults.images && searchResults.images.length > 0 && (
            <Section title="Images">
              <SearchResultsImageSection
                images={searchResults.images}
                query={searchResults.query}
              />
            </Section>
          )}
          <Section title="Sources">
            <SearchResults results={searchResults.results} />
          </Section>
        </>
      ) : (
        <Section className="pt-2 pb-0">
          <SearchSkeleton />
        </Section>
      )}
    </div>
  );
}
