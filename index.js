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