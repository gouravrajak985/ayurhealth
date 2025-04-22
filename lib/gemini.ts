import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function getAyurvedicAdvice(message: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `As an Ayurvedic health advisor, provide personalized advice based on the following information. Focus on practical, holistic recommendations incorporating diet, lifestyle, and natural remedies. Keep the response concise and actionable. Use markdown formatting to structure your response with appropriate headings, lists, and emphasis where needed.

User message: ${message}

Format your response using markdown with:
- Clear headings for different sections (##)
- Bullet points for lists
- *Emphasis* for important points
- > Blockquotes for traditional wisdom
- \`inline code\` for specific terms
- Proper spacing and formatting

Remember to maintain a supportive and knowledgeable tone while providing structured, easy-to-read advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    throw new Error("Failed to get AI response");
  }
}

export async function getAyurvedicDietPlan(userProfile: {
  weight: number;
  height: number;
  gender: string;
  age: number;
  foodPreference: string;
  [key: string]: any;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `As an Ayurvedic nutritionist, create a detailed 7-day diet plan based on the following user profile:

Weight: ${userProfile.weight} kg
Height: ${userProfile.height} cm
Gender: ${userProfile.gender}
Age: ${userProfile.age}
Food Preference: ${userProfile.foodPreference}

Create a 7-day diet plan with the following structure for each day:
[
  {
    "day": "Monday",
    "meals": [
      {
        "time": "Breakfast (7-8 AM)",
        "items": ["Item 1", "Item 2"],
        "herbs": ["Herb 1", "Herb 2"],
        "recipe": {
          "name": "Recipe Name",
          "ingredients": ["Ingredient 1", "Ingredient 2"],
          "instructions": ["Step 1", "Step 2"]
        }
      }
    ],
    "remedies": ["Remedy 1", "Remedy 2"]
  }
]

Important:
- Follow the exact JSON structure shown above
- Include 3-4 meals per day (breakfast, lunch, dinner, and optional snacks)
- Each meal should have 2-4 items and 1-2 herbs
- Include one detailed recipe per meal
- Add 2-3 daily Ayurvedic remedies
- Keep recipes practical with easily available ingredients
- Focus on balancing doshas and promoting wellness
- Ensure the response is a valid JSON array`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error getting diet plan:", error);
    throw new Error("Failed to generate diet plan");
  }
}