we’re going to build a Discord chatbot using Node.js and OpenAI’s GPT-3 language model. With OpenAI’s GPT-3 API, you can — with just a few lines of code — create a bot that can produce code, tell jokes and stories, develop recipes, and whatever else you can think of.

# Things you’ll need

- A code editor like Visual Studio Code or WebStorm
- An OpenAI API key
- Node.js v16 or newer
- A Discord account

# Getting set-up

## Initialize your app

   In this step, you’ll set up your Node.js application for your chatbot.
   
Create a new folder called “discordbot” — this will be your project’s root. 

From the project root, initialize Node to generate a package.json file to house dependencies and other metadata.

**Here's a suggested file structure for your project:**
```scss
my-discord-bot/
├── node_modules/
├── src/
│   ├── index.js (Discord bot main file)
│   ├── chatbot.js (OpenAI chat functionality)
├── package.json
|── .env
|── .gitignore
|── README.md
```

## Install dependencies

You need to install these Node packages for your project:

   - Discord.JS — Discord’s official package for interacting with their API.
   - OpenAI Node.js Library — The official API library for OpenAI.
   - Dotenv — To store and access environment variables.

```sh
npm init -y
npm install discord.js @discordjs/opus ytdl-core @discordjs/voice openai dotenv
```

## Define your environment variables

To keep your API keys secure, you’ll use the `dotenv` package to store them as environment variables. This way, they won’t be exposed in your code.

First, create a file called .env in your project’s root directory by running the command: `touch .env`
```sh
touch .env
```

Then, open the .env file with your code editor and add the following lines:

```sh
OPENAI_API_KEY=XXXXXXXX  
BOT_TOKEN=XXXXXXXX  
# Be sure to add the .env file to your .gitignore file,  
# especially if you plan to publish your repo publicly.
```

## Set-up Discord

**Server**
The first step is setting up a Discord server for testing your bots. Even if you already have a server set up, I suggest setting up a server explicitly to test your bots.

### Setting up a discord bot

First, we need to create a new application on the discord development portal.

We can do so by visiting the [portal](https://discordapp.com/developers/applications/?ref=gabrieltanner.org) and clicking on new application.
![bot1](https://github.com/0xHy0kR1/HarmonyAI/assets/90767483/fdb55e2a-855b-4c81-a241-46bcaddf3030)

After that, we need to give our application a name and click the create button.
![bot2](https://github.com/0xHy0kR1/HarmonyAI/assets/90767483/86a5605c-5911-4767-a020-4c2905cda035)

After that, we need to select the bot tab and click on add bot.
![bot3](https://github.com/0xHy0kR1/HarmonyAI/assets/90767483/23fd8d06-05b5-4d9c-b490-80d90f41a7fd)

Now our bot is created and we can continue with inviting it to our server.

### Adding the bot to your server

After creating our bot we can invite it using the OAuth2 URL Generator.

For that, we need to navigate to the OAuth2 page and select bot in the scope tap.
![bot4](https://github.com/0xHy0kR1/HarmonyAI/assets/90767483/27dd122e-ce84-40c7-b673-04ca4ed8d294)

After that, we need to select the needed permissions to play music and read messages.
![bot5](https://github.com/0xHy0kR1/HarmonyAI/assets/90767483/d462e35a-64e2-4b31-b90d-566e2f905705)

Then we can copy our generated URL and paste it into our browser.
![bot6](https://github.com/0xHy0kR1/HarmonyAI/assets/90767483/bc586750-36fa-4ffd-acfa-d691cc0bc59a)

After pasting it, we add it to our server by selecting the server and clicking the authorize button.
![bot7](https://github.com/0xHy0kR1/HarmonyAI/assets/90767483/c23907f3-96fa-4f5f-94d3-0e014d4d14c6)

# Building the GPT-3 Chatbot

Creating the main(index.js) entry point of your Discord bot

It's responsible for setting up and running the bot, handling the `ready` event when the bot logs in, and routing incoming messages to the appropriate functionality, which is chatbot and musicbot in this case.

1. **Importing Dependencies:**
```js
const { Client, GatewayIntentBits } = require("discord.js");
```
   - This line imports the `Client` and `GatewayIntentBits` classes from the 'discord.js' library.
   - `Client` is used to create an instance of the Discord bot, and `GatewayIntentBits` are used to specify which events your bot will listen to.

2. **Creating the Discord Client:**
```js
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});
```
   - Here, you create an instance of the `Client` class, which represents your Discord bot.
   - You specify the intents your bot will use within the `intents` array.
   - In this case, your bot has access to information about guilds (servers) and can listen for messages in those guilds.
   - These intents are used to control which types of events your bot can access, such as guild events, messages, and voice state updates.

3. **Importing Chatbot and Musicbot Modules:**
```js
const chatbot = require('./chatbot');
const musicbot = require('./musicbot');
```
   - These lines import the `chatbot` and `musicbot` modules from separate files (presumably named 'chatbot.js' and 'musicbot.js').
   - These modules contain the logic for handling chat functionality and music functionality, respectively.

4. **Handling the 'ready' Event:**
```js
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});
```
   - This part sets up an event listener for the 'ready' event.
   - When your bot successfully logs in to Discord, this event is triggered, and it prints a message to the console, indicating that the bot is logged in and ready to use.

5. **Handling Incoming Messages:**
```js
client.on('messageCreate', (message) => {
  chatbot.handleMessage(message);
});
```
   - This code sets up an event listener for the 'messageCreate' event. Whenever a message is created in any guild where your bot is a member, this event is triggered.
   - Within this event handler, the `chatbot` module's `handleMessage` function are called, which allows your bot to handle chat messages and music bot commands accordingly.
	   - `chatbot.handleMessage(message)` is responsible for processing chat messages and responding to them, if applicable.

## Integrating GPT-3

   Before we start integrating GPT-3, it’s important to understand how it works under the hood. The backbone of the OpenAI API is the completions endpoint. This is where you provide a prompt, and the model generates a text completion based on the context or pattern of the prompt.
   
   For example, if you give the prompt “ask not what your country can do for you,” the API will return the completion “ask what you can do for your country.” The concept of _prompts_ is very important to understanding how to work with GPT-3
   
   **Here is a simple example of a product name generator.**
   
   **Prompt**
```powershell
Product description: A home milkshake maker   
Seed words: fast, healthy, compact.   
Product names: HomeShaker, Fit Shaker, QuickShake, Shake Maker   
Product description: A pair of shoes that can fit any foot size.   
Seed words: adaptable, fit, omni-fit.   
```

**Sample response**
```powershell
Product names: AdaptFit, OmniSecure, Fit-All, AdaptShoes.
```
   - Essentially you are playing a game of “finish my thought” with GPT-3.
   - This process of designing prompts is aptly named `prompt engineering`. A quick google search will show that it‘s become a bit of a cottage industry. And for a good reason — it's an extremely powerful but easy-to-grasp way of generating high-quality, purpose-built content. Want to write a technical blog post in the style and language of Shakespeare… easy!

#### Building chatbot functionality

To build chatbot functionality, we are going add another file(chatbot.js) which handles chat functionality.

1. **Importing Dependencies:**
```js
const OpenAIApi = require("openai");
require("dotenv").config();
```
   - You're importing the required dependencies, which include the `openai` library for interacting with the OpenAI GPT-3 API and the `dotenv` library to load environment variables from a .env file.

2. **Initializing the OpenAI Client**:
```js
const openai = new OpenAIApi({ key: process.env.OPENAI_API_KEY });
```
   - You initialize the OpenAI API client using your API key stored in the `.env` file.

3. **handleMessage Function**:
```js
const handleMessage = async (message) => {
// Rest of the code
}
```
   - `handleMessage` is an asynchronous function that processes incoming messages.

4. **Input Validation:**
```js
if (message.author.bot) return;
```
   - The function starts by checking if the message sender is a bot. If the message is sent by a bot, the function exits, preventing the bot from responding to other bots.

5. **User Input Handling**:
```js
const userInput = message.content;
```
   - It captures the user's input message from `message.content`.

6. **Constructing a Prompt**:
```js
let prompt = `
Question: ${userInput}\n\
lisbun:`;
const userQuery = prompt;
```
   - A prompt is constructed, which includes the user's input question and a continuation prompt for the chatbot.
   - This is the text that will be sent to the GPT-3 API for generating a response.

7. **Making the API Request**:
```js
const completion = await openai.completions.create({
        model: "text-davinci-003",
        prompt: userQuery,
        max_tokens: 2500,
        temperature: 0.3,
        top_p: 0.3,
        presence_penalty: 0,
        frequency_penalty: 0.5,
});
```
   - The code makes an asynchronous call to the OpenAI API using the `openai.completions.create` method.
   - It passes in various parameters, including the model to use, the prompt, and other settings like `max_tokens`, `temperature`, and `top_p`. These settings control the length and randomness of the generated response.

8. **Processing the API Response**:
```js
if (completion.choices && completion.choices.length > 0) {
        const generatedText = completion.choices[0].text;
        return message.reply(generatedText);
      } else {
        return message.reply(
          "The response from the AI was unexpected. Please try again."
        );
      }
```
   - It checks if the API response includes choices and if the length is greater than 0. If so, it extracts the generated text from the response and sends it as a reply to the user's message.

9. **Error Handling**:
```js
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
```
   - If there's an error during the API call or if the response is unexpected, it logs the error and sends an error message back to the user.

10. **Exporting the Function**:
```js
module.exports = { handleMessage };
```
   - The `handleMessage` function is exported so that it can be used in other parts of your code, likely in the file where you handle Discord messages.

#### index.js 
```js
const { Client, GatewayIntentBits } = require("discord.js");
const chatbot = require('./chatbot.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    try {
        await message.fetch(); // Wait for the message to be fully loaded
        chatbot.handleMessage(message);
        // musicbot.handleCommands(message);
    } catch (error) {
        console.error("Error fetching message:", error);
    }
});


client.on("error", console.error);
client.on("warn", console.warn);

client.login(process.env.BOT_TOKEN);
```

#### chatbot.js
```js
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
```

Run the code using "node index" commad.

#### Sample test of chatbot - 
![test_result](https://github.com/0xHy0kR1/HarmonyAI/assets/90767483/8915a391-3fae-4371-97b5-017e28754808)
