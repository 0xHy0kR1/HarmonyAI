const { Client, GatewayIntentBits } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const chatbot = require('./chatbot.js');
const musicbot = require('./musicbot');

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
        console.log(`Received message: ${message.content}`);
        chatbot.handleMessage(message);
        console.log("message event");
    } catch (error) {
        console.error("Error fetching message:", error);
    }
});


client.on("error", console.error);
client.on("warn", console.warn);

client.login(process.env.BOT_TOKEN);