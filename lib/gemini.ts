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

    const prompt = `Create a 7-day Ayurvedic diet plan based on the following preferences. The response must strictly follow the specified JSON structure.

User preferences: ${JSON.stringify(preferences)}

Return a JSON array of daily plans with exactly this structure:
{
  "dailyPlans": [
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
}

Requirements:
- Include exactly 7 days (Monday through Sunday)
- Each day must have at least 3 meals (Breakfast, Lunch, Dinner)
- Each meal must have items, herbs, and a recipe
- Include daily Ayurvedic remedies
- All arrays must have at least 2 items
- No null or empty values allowed`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Remove any markdown code blocks
    text = text.replace(/```json\n?|\n?```/g, '');
    
    try {
      const dietPlan = JSON.parse(text);
      
      // Validate the structure
      if (!dietPlan.dailyPlans || !Array.isArray(dietPlan.dailyPlans)) {
        throw new Error('Invalid diet plan structure');
      }
      
      // Ensure we have exactly 7 days
      if (dietPlan.dailyPlans.length !== 7) {
        throw new Error('Diet plan must have exactly 7 days');
      }
      
      return dietPlan.dailyPlans;
    } catch (error) {
      console.error("Error parsing diet plan:", error);
      throw new Error("Failed to generate valid diet plan");
    }
  } catch (error) {
    console.error("Error getting diet plan:", error);
    throw new Error("Failed to generate diet plan");
  }
}

export async function getAyurvedicRecommendations(preferences: any) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate personalized Ayurvedic wellness recommendations based on the following user profile. The response must strictly follow the specified JSON structure.

User profile: ${JSON.stringify(preferences)}

Return a JSON object with exactly this structure:
{
  "recommendations": {
    "mental": [
      {
        "title": "Practice Name",
        "description": "Brief description",
        "benefits": ["Benefit 1", "Benefit 2"],
        "instructions": ["Step 1", "Step 2"],
        "contraindications": ["Warning 1", "Warning 2"]
      }
    ],
    "physical": [
      {
        "title": "Exercise Name",
        "description": "Brief description",
        "benefits": ["Benefit 1", "Benefit 2"],
        "instructions": ["Step 1", "Step 2"],
        "contraindications": ["Warning 1", "Warning 2"]
      }
    ]
  }
}

Requirements:
- Include at least 3 mental practices (meditation, breathing exercises, etc.)
- Include at least 3 physical exercises (yoga poses, stretches, etc.)
- All recommendations must be based on Ayurvedic principles
- Each recommendation must have all fields filled
- Focus on practices suitable for the user's profile
- Include clear instructions and safety warnings
- Keep descriptions concise but informative`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Remove any markdown code blocks
    text = text.replace(/```json\n?|\n?```/g, '');
    
    try {
      const recommendations = JSON.parse(text);
      
      // Validate the structure
      if (!recommendations.recommendations || !recommendations.recommendations.mental || !recommendations.recommendations.physical) {
        throw new Error('Invalid recommendations structure');
      }
      
      return recommendations.recommendations;
    } catch (error) {
      console.error("Error parsing recommendations:", error);
      throw new Error("Failed to generate valid recommendations");
    }
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw new Error("Failed to generate recommendations");
  }
}

export async function analyzeSleepQuality(messages: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze the following chat messages about sleep and wellness. Determine the overall sleep quality as either "good", "average", or "bad". Only respond with one of these three words.

Chat history:
${JSON.stringify(messages, null, 2)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const quality = response.text().trim().toLowerCase();
    
    // Ensure we only return valid values
    console.log("Analyzed sleep quality:", quality);
    if (!['good', 'average', 'bad'].includes(quality)) {
      return 'average';
    }
    
    return quality;
  } catch (error) {
    console.error("Error analyzing sleep quality:", error);
    return 'average';
  }
}