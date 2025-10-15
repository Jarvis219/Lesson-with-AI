import { GoogleGenerativeAI } from "@google/generative-ai";

// Test function to verify Google AI integration
export async function testGoogleAI(apiKey: string) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent("Hello, how are you?");
    const response = await result.response;
    const text = response.text();

    console.log("Google AI Test Response:", text);
    return { success: true, response: text };
  } catch (error) {
    console.error("Google AI Test Error:", error);
    return { success: false, error: error.message };
  }
}
