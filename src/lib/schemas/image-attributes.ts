import { DeepPartial } from "ai";
import { z } from "zod";

export const imageAttributeSchema = z.object({
  type: z.string().describe("Type of clothing or shoes"),
  color: z.string().describe("Color of the item"),
  brand: z.string().describe("Brand of the item"),
  size: z.string().nullable().describe("Size of the item"),
  description: z.string().describe("Description of the item"),
  gender: z
    .enum(["male", "female", "unisex"])
    .describe("Gender suitability of the item"),
});

export type PartialInquiry = DeepPartial<typeof imageAttributeSchema>;