// src/index.js
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Prefix for commands
const PREFIX = "fd ";

// Bot ready event (new in discord.js v15+)
client.once('clientReady', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle prefix commands
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Test command
    if (command === "ping") {
        return message.reply("🏓 Pong!");
    }

    // Show cash
    if (command === "cash") {
        return message.reply("💰 You have 1000 coins (demo).");
    }

    // Pay coins
    if (command === "pay") {
        const user = message.mentions.users.first();
        const amount = args[1];
        if (!user || !amount) {
            return message.reply("❌ Usage: `fd pay @user <amount>`");
        }
        return message.reply(`✅ Paid ${amount} coins to ${user.username}`);
    }

    // Example coinflip (cf) command
    if (command === "cf") {
        const result = Math.random() < 0.5 ? "Heads 🎲" : "Tails 🎲";
        return message.reply(`Coinflip result: **${result}**`);
    }

    // Admin give command
    if (command === "give") {
        const user = message.mentions.users.first();
        const amount = args[1];
        if (!user || !amount) {
            return message.reply("❌ Usage: `fd give @user <amount>`");
        }
        return message.reply(`✅ Gave ${amount} coins to ${user.username} (admin command).`);
    }
});

client.login(process.env.TOKEN);
