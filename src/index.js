// index.js
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const PREFIX = "fd";
client.commands = new Collection();

// ✅ Load all commands from src/commands
const commandsPath = path.join(__dirname, "src/commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command.name) {
    client.commands.set(command.name, command);
    console.log(`Loaded command: ${command.name}`);
  }
}

// When bot is ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Handle messages
client.on("messageCreate", async (message) => {
  // Debugging: log all messages
  console.log("Message received:", message.content);

  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) {
    console.log(`❌ Command not found: ${commandName}`);
    return;
  }

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("⚠️ There was an error executing that command.");
  }
});

// Login bot
client.login(process.env.DISCORD_TOKEN);
