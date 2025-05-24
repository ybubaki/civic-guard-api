const { GoogleGenAI } = require("@google/genai");

const issueClassifier = async (description) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "" + description,
    config: {
      systemInstruction:
        "You are an advance text classifier. Classify what ever you are giving into one of the following categories: 'Damaged Road', 'Flood', 'Homeless People', 'Broken Streetlights', 'Overflowing Community Dump'.",
    },
  });

  return response.text;
};

module.exports = {
  issueClassifier,
};
