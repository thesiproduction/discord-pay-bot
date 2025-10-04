// index.js
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

// Create client with all needed intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
});

const PREFIX = "fd"; // your prefix
const balances = {}; // simple in-memory balance system

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Helper: get balance
function getBalance(userId) {
  if (!balances[userId]) balances[userId] = 1000; // start with 1000 coins
  return balances[userId];
}

// Message handler
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.toLowerCase().startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // FD CASH
  if (command === "cash") {
    const bal = getBalance(message.author.id);
    return message.reply(`💰 You have ${bal} coins.`);
  }

  // FD PAY
  if (command === "pay") {
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target) return message.reply("❌ Mention a user to pay.");
    if (isNaN(amount) || amount <= 0) return message.reply("❌ Enter a valid amount.");

    const senderBal = getBalance(message.author.id);
    if (senderBal < amount) return message.reply("❌ You don’t have enough coins.");

    balances[message.author.id] -= amount;
    balances[target.id] = getBalance(target.id) + amount;

    return message.reply(`✅ You paid ${amount} coins to ${target.username}.`);
  }

  // FD GIVE (Admin only)
  if (command === "give") {
    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ Only admins can use this command.");
    }

    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target) return message.reply("❌ Mention a user.");
    if (isNaN(amount) || amount <= 0) return message.reply("❌ Enter a valid amount.");

    balances[target.id] = getBalance(target.id) + amount;
    return message.reply(`✅ Gave ${amount} coins to ${target.username}.`);
  }

  // FD CF (Coinflip)
  if (command === "cf") {
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0) return message.reply("❌ Enter a valid amount.");

    const bal = getBalance(message.author.id);
    if (bal < amount) return message.reply("❌ You don’t have enough coins.");

    const win = Math.random() < 0.5;
    if (win) {
      balances[message.author.id] += amount;
      return message.reply(`🎉 You won! New balance: ${balances[message.author.id]} coins.`);
    } else {
      balances[message.author.id] -= amount;
      return message.reply(`😢 You lost! New balance: ${balances[message.author.id]} coins.`);
    }
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);

