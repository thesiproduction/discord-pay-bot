const { addBalance } = require("../utils/db");

// Add your Discord IDs here
const ADMINS = [
  "1345060023755345982", // replace with your Discord ID
  "987654321098765432"  // you can add more
];

module.exports = {
  name: "give",
  description: "Give Fundra Currency to a user (Admin only)",
  async execute(message, args) {
    if (!ADMINS.includes(message.author.id)) {
      return message.reply("❌ You are not authorized to use this command.");
    }

    const mention = message.mentions.users.first();
    if (!mention) return message.reply("❌ Mention a user.");
    const amount = parseInt(args[1]);
    if (isNaN(amount) || amount <= 0) return message.reply("❌ Enter a valid amount.");

    const newBal = await addBalance(mention.id, amount);
    message.reply(`✅ Gave ${amount} FC to ${mention.username}. New balance: ${newBal} FC`);
  },
};
