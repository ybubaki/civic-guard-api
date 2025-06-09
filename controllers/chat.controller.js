const { chatAI } = require("../utils/ai");

const chat = async (req, res) => {
  const { message, type } = req.body;

  let config = {};

  if (type === "question") {
    config = {
      systemInstruction: `Answer the question using the text below. Respond with only the text provided. if the question is not about how to make a report, ignore it.
    
    Text:
    Question: How do I make a report?
    Answer: 
    - To make a report, you can visit the home screen or My History screen and click on the "Create Report" button.
    - Take a photo of the issue and provide a description.
    - Provide the city name.
    - Click on the "Submit" button.
    - You must be at the location of the issue when you make the report.
    `,
    };
  } else if (type === "aid") {
    config = {
      systemInstruction: `All questions should be answered comprehensively with details, unless the user requests a concise response specifically. only respond to question about how to provide first aid any other question should be ignored. All case are relate to Ghana only unless otherwise stated.`,
    };
  }

  try {
    const response = await chatAI(message, config);

    return res.json({
      data: {
        message: response,
        type: "ai",
      },
      message: "Chat response generated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      data: null,
      message:
        "Internal error while generating chat response. Please try again.",
    });
  }
};

module.exports = {
  chat,
};
