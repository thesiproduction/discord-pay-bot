const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const prefix = "fd "; // prefix you want

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('clientReady', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // ignore bot messages
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "pay") {
    const user = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!user || isNaN(amount)) {
      return message.reply("Usage: `fd pay @user <amount>`");
    }

    // For now just respond (later we can connect db.js)
    return message.reply(`💸 Paid ${amount} coins to ${user.username}`);
  }

  if (command === "cash") {
    return message.reply("💰 You have 100 coins (demo, hook DB here)");
  }

  if (command === "give") {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ You don’t have permission to use this.");
    }
    const user = message.mentions.users.first();
    const amount = parseInt(args[1]);
    if (!user || isNaN(amount)) {
      return message.reply("Usage: `fd give @user <amount>`");
    }
    return message.reply(`🎁 Gave ${amount} coins to ${user.username}`);
  }
});

client.login(process.env.TOKEN);
