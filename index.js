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

client.on('messageCreate', (message) => {
    chatbot.handleMessage(message);
    console.log("message event");
});

client.on("error", console.error);
client.on("warn", console.warn);

client.login(process.env.BOT_TOKEN);