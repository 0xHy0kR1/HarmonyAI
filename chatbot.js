const OpenAIApi = require("openai");
require("dotenv").config();
const openai = new OpenAIApi({ key: process.env.OPENAI_API_KEY });

const handleMessage = async (message) => {
  if (message.author.bot) return;
  const userInput = message.content;
  let prompt = `
Question: ${userInput}\n\ 
lisbun:`;
  const userQuery = prompt;
  console.log("userInput value: "+userInput);

  try {
      const completion = await openai.completions.create({
        model: "text-davinci-003",
        prompt: userQuery,
        max_tokens: 2500,
        temperature: 0.3,
        top_p: 0.3,
        presence_penalty: 0,
        frequency_penalty: 0.5,
      });


      if (completion.choices && completion.choices.length > 0) {
        const generatedText = completion.choices[0].text;
        return message.reply(generatedText);
      } else {
        return message.reply(
          "The response from the AI was unexpected. Please try again."
        );
      }
    } 
    catch (err) {
      console.error(err);
      return message.reply(
        "Sorry, something went wrong. I am unable to process your query."
      );
    }
};

module.exports = { handleMessage };
