import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.0-pro";

// Paste Your API KEY Below
const API_KEY = "AIzaSyBoIkbkZbQJCM8-YogyRaH0FyOsqdsIRUE";
const history = [];

async function runChat(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.75,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  // if (history.length === 0) {
  //   history.push({
  //     role: "user",
  //     parts: "Always give response in html format only and without ```html```",
  //   });
  // }

  console.log(history, "his1");

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: history,
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;

  history.push({ role: "user", parts: prompt });
  history.push({ role: "model", parts: response.text() });

  console.log(response);

  const pattern = /<!DOCTYPE html>[\s\S]*<\/html>/;
  const match = response.text().match(pattern);

  if (match) {
    return match[0];
  } else {
    return "Please ask valid question.";
  }
}

export default runChat;
