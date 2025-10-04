const { Client, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

// Prefix
const PREFIX = "fd";

// Command handler
client.commands = new Map();

// Load all command files from ./src/commands
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`);
  client.commands.set(command.name, command);
  console.log(`✅ Loaded command: ${command.name}`);
}

// Ready event
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Message event
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  // Remove prefix and split message
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  try {
    await client.commands.get(commandName).execute(client, message, args);
  } catch (err) {
    console.error(err);
    message.reply("⚠️ There was an error running that command.");
  }
});

// Start bot
client.login(process.env.TOKEN);
