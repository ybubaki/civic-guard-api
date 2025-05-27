const { GoogleGenAI, Type } = require("@google/genai");

const issueClassifier = async (description) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "" + description,
    config: {
      systemInstruction:
        "You are an advance text classifier and title generator. Classify what ever you are giving into one of the following categories: 'Damaged Road', 'Flood', 'Homeless People', 'Broken Streetlights', 'Overflowing Community Dump'. Also from the text you are given, assign a priority to the issue. The priority can be 'high', 'medium', or 'low'. Also generate a title for the issue.",
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
        },
        propertyOrdering: ["category", "priority", "title"],
      },
    },
  });

  return response.text;
};

module.exports = {
  issueClassifier,
};
