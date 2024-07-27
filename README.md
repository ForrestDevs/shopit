# Shop-It: Fashion Identification and Recommendation API

Shop-It is an innovative Fashion Identification and Recommendation API that revolutionizes the online shopping experience. It addresses the common frustration of identifying and locating fashion items seen in everyday life or on social media.

Using advanced AI and image recognition technology, Shop-It allows users to simply upload a photo of a desired fashion item. The system then analyzes the image, identifies the item, and provides direct shopping links to purchase it, including options for both new and used items.

### Key Features

1. Image recognition to identify fashion items
2. AI-powered search query generation for accurate results
3. Web scraping to gather comprehensive product information
4. Intelligent product matching and recommendation
5. User-friendly presentation of results with essential details

### Target Users

- Fashion enthusiasts
- Social media influencers
- Personal shoppers
- General consumers

## 🛠️ Technology Stack

Shop-It leverages cutting-edge technologies including:

- **Next.js**: Because serverless is king.
- **TRPC**: Typesafe composable backend API framework.
- **TypeScript**: Because your soy if you don't.
- **Vercel AI SDK**: For ease of swapping out models + streaming UI.
- **LangChain AI**: For managing the ai pipeline, embeddings, and tools.
- **TailwindCSS + ShadCN**: To quickly style and build the frontend.

By combining these technologies, Shop-It offers a seamless, efficient solution to transform the online fashion shopping landscape, streamlining the process of finding and purchasing desired fashion items.

## 📜 Problem Statement

In today's digital age, fashion enthusiasts face a common challenge:

1. They spot desirable fashion items in real life or on social media.
2. Identifying these items accurately proves difficult.
3. Finding where to purchase them becomes a time-consuming, often fruitless task.
4. Locating similar alternatives or better deals is equally challenging.

This process leads to frustration, wasted time, and missed shopping opportunities. Consumers need a quick, efficient way to bridge the gap between seeing a fashion item and being able to purchase it.

Shop-It addresses this problem by providing an AI-powered solution that simplifies the journey from image to purchase, revolutionizing how people discover and shop for fashion.

## ✅ Solution: Shop-It

Imagine snapping a pic of those awesome Yeezys and getting instant shopping links. Cool, right? Let's make it happen!

**Shop-It** aims to solve these pain points by providing a streamlined, efficient service that can identify fashion items from a photo and recommend places to purchase them, both new and used. By leveraging advanced image recognition and AI-powered recommendations, Shop-It transforms the shopping experience, making it easier for consumers to find and buy the items they love.

### Use Cases
1. **Fashion Enthusiasts**: Individuals who frequently follow fashion trends and want to quickly find and purchase the latest styles.
2. **Social Media Influencers**: Influencers looking to provide their followers with direct links to the fashion items they showcase.
3. **Personal Shoppers**: Professionals who need to efficiently find specific fashion items for their clients.
4. **General Consumers**: Anyone who spots a fashion item they like in real life or online and wants an easy way to find and purchase it.

## 📚 Abstract Discussion

### Implementing AI Image Detection and Recommendation System

Utilizing LangChain we can create a pipeline that manages all stages of the given task. 

### 1. Image Recognition
- Utilizes various vision-capable models
- Implemented using Vercel AI SDK for easy model swapping and testing

### 2. Search Query Generation
- AI model creates specific search queries based on recognized image
- Includes details like color, size, item name, and brand

### 3. Web Search
- Employs BrowserBase or LangChain Search tool
- Searches the web for purchase links based on generated queries

### 4. Data Scraping
- Uses BrowserBase or Firecrawl to extract product information
- Gathers details such as sizes, colors, prices, brands, and stock availability

### 5. Product Matching and Presentation
- Processes scraped data using an LLM
- Selects top 5-10 products matching the original image
- Displays results in card format with key information:
  * Product name
  * Price
  * Size
  * Color
  * Stock availability
  * Retailer
  * Purchase link

This tool streamlines the process of finding and purchasing products similar to those seen in images, offering users a convenient and efficient shopping solution.