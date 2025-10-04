console.log("🚀 Index.js is running (latest code)!");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.commands = new Collection();

// ✅ Load commands dynamically
const commandsPath = path.join(__dirname, "commands");
console.log("🔍 Looking for commands in:", commandsPath);

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
  console.log("📂 Command files found:", commandFiles);

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = require(filePath);

      if (!command.name || !command.execute) {
        console.log(`⚠️ Skipping ${file} → Missing "name" or "execute"`);
        continue;
      }

      client.commands.set(command.name, command);
      console.log(`✅ Loaded command: ${command.name}`);
    } catch (err) {
      console.error(`❌ Error loading ${file}:`, err);
    }
  }
} else {
  console.error("❌ Commands folder not found!");
}

// 🟢 Bot ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// 📩 Message listener
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("fd") || message.author.bot) return;

  const args = message.content.slice(2).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  console.log(`📩 Message received: ${message.content}`);
  console.log(`➡️ Parsed command: ${commandName}, Args: ${args}`);

  const command = client.commands.get(commandName);
  if (!command) {
    console.log(`❌ Command not found: ${commandName}`);
    return;
  }

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error("❌ Error executing command:", error);
    await message.reply("⚠️ There was an error executing that command!");
  }
});

client.login(process.env.DISCORD_TOKEN);
