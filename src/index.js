require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();

// ✅ Load commands from ./commands folder
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.name, command);
  console.log(`✅ Loaded command: ${command.name}`);
}

// 🟢 Bot ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// 📩 Message listener
client.on("messageCreate", async message => {
  if (!message.content.startsWith("fd") || message.author.bot) return;

  const args = message.content.slice(2).trim().split(/ +/);
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
    await message.reply("⚠️ There was an error executing that command!");
  }
});

client.login(process.env.DISCORD_TOKEN);
