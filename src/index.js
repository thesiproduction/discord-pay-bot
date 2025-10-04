import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const prefix = "fd ";
const balances = {}; // in-memory storage

function getBalance(userId) {
  if (!balances[userId]) balances[userId] = 0;
  return balances[userId];
}

function addBalance(userId, amount) {
  if (!balances[userId]) balances[userId] = 0;
  balances[userId] += amount;
  return balances[userId];
}

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Prefix commands
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // fd cash
  if (command === "cash") {
    const bal = getBalance(message.author.id);
    return message.reply(`💰 You have **${bal} coins**`);
  }

  // fd give @user amount (admin only)
  if (command === "give") {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ Only admins can use this command.");
    }
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);
    if (!target || isNaN(amount)) {
      return message.reply("Usage: fd give @user <amount>");
    }
    const bal = addBalance(target.id, amount);
    return message.reply(`✅ Gave ${amount} coins to ${target.username}. They now have ${bal} coins.`);
  }

  // fd pay @user amount
  if (command === "pay") {
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);
    if (!target || isNaN(amount)) {
      return message.reply("Usage: fd pay @user <amount>");
    }
    if (getBalance(message.author.id) < amount) {
      return message.reply("❌ You don’t have enough coins.");
    }
    addBalance(message.author.id, -amount);
    const bal = addBalance(target.id, amount);
    return message.reply(`✅ You paid ${amount} coins to ${target.username}. They now have ${bal} coins.`);
  }

  // fd cf amount (coinflip)
  if (command === "cf") {
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0) return message.reply("Usage: fd cf <amount>");
    if (getBalance(message.author.id) < amount) {
      return message.reply("❌ Not enough coins to bet.");
    }

    const win = Math.random() < 0.5;
    if (win) {
      addBalance(message.author.id, amount);
      return message.reply(`🎉 You won! You now have ${getBalance(message.author.id)} coins.`);
    } else {
      addBalance(message.author.id, -amount);
      return message.reply(`😢 You lost! You now have ${getBalance(message.author.id)} coins.`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
