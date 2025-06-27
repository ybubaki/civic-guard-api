const { GoogleGenAI, Type } = require("@google/genai");
const fs = require("fs");

const issueClassifier = async (description, file) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Read the file from disk
  const base64ImageFile = fs.readFileSync(file.path, {
    encoding: "base64",
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        text: `
        Content: ${description} \n
You are an advanced AI that performs the following tasks:

1. Image and Text Classification

Given an image and a content text, classify the issue described by both into one of the following categories:

- Damaged Road
- Flood
- Homeless People
- Broken Streetlights
- Overflowing Community Dump

2. Priority Assignment

Based only on the **content text**, assign a **priority** level to the issue. Use one of the following:

- high
- medium
- low

3. Title Generation

Generate a short, clear, and descriptive title for the issue based on the content text.


4. Conclusion Check

Compare the image and the content text:

- If both **clearly refer to the same category**, return: conclusion: true

- If the image and text refer to **different categories**, return: conclusion: false

- If either the image or text does **not align with any of the given categories**, return: conclusion: false
`,
      },
      {
        inlineData: {
          mimeType: file.mimetype,
          data: base64ImageFile,
        },
      },
    ],
    config: {
      // systemInstruction:
      //   "You are an advance text and image classifier and title generator. Classify the image and the text given into one of the following categories: 'Damaged Road', 'Flood', 'Homeless People', 'Broken Streetlights', 'Overflowing Community Dump'. Also from the text you are given, assign a priority to the issue. The priority can be 'high', 'medium', or 'low'. Also generate a title for the issue. If the image or text is not in any way aligned to the description or any of the categories, return the word 'Unknown'",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
          },
          priority: {
            type: Type.STRING,
          },
          title: {
            type: Type.STRING,
          },
          conclusion: {
            type: Type.BOOLEAN,
          },
        },
        propertyOrdering: ["category", "priority", "title", "conclusion"],
      },
    },
  });

  return response.text;
};

const chatAI = async (message, config) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: message,
    config,
  });

  return response.text;
};

module.exports = {
  issueClassifier,
  chatAI,
};
