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

export async function getAyurvedicDietPlan(preferences: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a personalized Ayurvedic diet plan based on the following preferences and requirements. Format the response as a valid JSON string with proper escaping of special characters.

User preferences: ${JSON.stringify(preferences)}

The response should be a JSON object with the following structure:
{
  "title": "string",
  "description": "string",
  "recommendations": {
    "general": ["string"],
    "avoid": ["string"]
  },
  "meals": {
    "breakfast": {
      "options": [
        {
          "name": "string",
          "ingredients": ["string"],
          "instructions": "string"
        }
      ]
    },
    "lunch": {
      "options": [
        {
          "name": "string",
          "ingredients": ["string"],
          "instructions": "string"
        }
      ]
    },
    "dinner": {
      "options": [
        {
          "name": "string",
          "ingredients": ["string"],
          "instructions": "string"
        }
      ]
    },
    "snacks": {
      "options": [
        {
          "name": "string",
          "ingredients": ["string"],
          "instructions": "string"
        }
      ]
    }
  }
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    
    text = text.replace(/```json|```/g, '').trim();

    try {
      // Try to parse the response as JSON
      const dietPlan = JSON.parse(text);
      return dietPlan;
    } catch (parseError) {
      console.error("Error parsing diet plan JSON:", parseError);
      
      // If JSON parsing fails, try to extract JSON from the response
      // Sometimes the model might include markdown or other text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          return extractedJson;
        } catch (extractError) {
          console.error("Error parsing extracted JSON:", extractError);
          throw new Error("Failed to parse diet plan response");
        }
      }
      
      throw new Error("Failed to generate diet plan");
    }
  } catch (error) {
    console.error("Error getting diet plan:", error);
    throw new Error("Failed to generate diet plan");
  }
}