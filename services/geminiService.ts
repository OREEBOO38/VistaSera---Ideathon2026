import { GoogleGenAI, Type } from "@google/genai";
import { Listing, MatchResult, ListingType } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing. Using mock AI responses.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Mock fallback for when API key is missing or quota exceeded
const getMockMatches = (myListing: Listing, candidates: Listing[]): MatchResult[] => {
    return candidates.slice(0, 3).map(c => ({
        listingId: c.id,
        score: Math.floor(Math.random() * 20) + 80, // Random 80-99 score
        reason: `High compatibility with ${c.material} based on your ${myListing.material} requirements. Close proximity in ${c.location.split(',')[0]}.`,
        potentialSavings: `Est. ₹${(c.quantity * 15).toLocaleString()} savings`
    }));
};

export const findAIConnectMatches = async (
  myListing: Listing,
  allListings: Listing[]
): Promise<MatchResult[]> => {
  const client = getClient();

  // Filter listings to find the opposite side of the transaction
  const targetType = myListing.type === ListingType.OFFER ? ListingType.REQUEST : ListingType.OFFER;
  const candidates = allListings.filter(l => l.type === targetType && l.userId !== myListing.userId);

  if (candidates.length === 0) return [];

  if (!client) {
      // Return mock data if no client
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      return getMockMatches(myListing, candidates);
  }

  const prompt = `
    I am a business with the following listing:
    ${JSON.stringify(myListing)}

    Here is a list of potential partners (candidates):
    ${JSON.stringify(candidates)}

    Please analyze these candidates and identify the top 3 best matches for industrial symbiosis.
    Consider material compatibility (critically important), location proximity (based on city names), and quantity alignment.
    
    Return the result as a JSON list of matches.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              listingId: { type: Type.STRING },
              score: { type: Type.NUMBER, description: "Match score between 0 and 100" },
              reason: { type: Type.STRING, description: "Why this is a good match" },
              potentialSavings: { type: Type.STRING, description: "Estimated economic or environmental benefit" }
            },
            required: ["listingId", "score", "reason", "potentialSavings"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MatchResult[];
    }
    return getMockMatches(myListing, candidates);
  } catch (error) {
    console.error("Error finding matches, falling back to mock:", error);
    return getMockMatches(myListing, candidates);
  }
};

export const generateImpactAnalysis = async (manifests: any[]) => {
    const client = getClient();
    if (!client) return "Based on your recent activity, you have successfully diverted significant waste from landfills, contributing to a circular economy ecosystem.";

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze these waste manifests and provide a 2-sentence summary of the positive environmental impact created by this company. Manifests: ${JSON.stringify(manifests)}`
        });
        return response.text || "Impact analysis unavailable.";
    } catch (e) {
        return "Your circular economy contributions are making a difference in reducing industrial waste.";
    }
}