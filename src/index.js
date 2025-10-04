const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const prefix = "fd "; // our command prefix

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Command collection
client.commands = new Map();

// Load commands from /commands folder
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  console.log(`✅ Loaded command: ${command.name}`);
}

// Bot ready
client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Message handler
client.on('messageCreate', async (message) => {
  // Ignore bots
  if (message.author.bot) return;

  // Ignore if no prefix
  if (!message.content.startsWith(prefix)) return;

  // Split command
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  console.log(`📩 Command received: ${commandName} Args: ${args}`);

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, null); // pass db later
  } catch (error) {
    console.error(error);
    message.reply("⚠️ Error executing that command.");
  }
});

// Login
client.login(process.env.TOKEN);
