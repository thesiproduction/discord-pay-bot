const { getBalance, setBalance } = require("../utils/db");

// List of Discord user IDs who are allowed to use this command
const ADMINS = [
  "123456789012345678", // Replace with your ID
  "987654321098765432", // Add more IDs here
  "112233445566778899"  // You can keep adding as many as needed
];

module.exports = {
  name: "remove",
  description: "Remove balance from a user (Admin only)",
  async execute(message, args) {
    // Check if user is allowed
    if (!ADMINS.includes(message.author.id)) {
      return message.reply("❌ You are not authorized to use this command.");
    }

    // Usage check
    if (args.length < 2) {
      return message.reply("Usage: `fd remove @user <amount>`");
    }

    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target) return message.reply("❌ Please mention a valid user.");
    if (isNaN(amount) || amount <= 0) return message.reply("❌ Please provide a valid positive amount.");

    // Get balance and subtract
    const currentBalance = await getBalance(target.id);
    const newBalance = Math.max(0, currentBalance - amount); // Prevent negative

    await setBalance(target.id, newBalance);

    return message.channel.send(
      `✅ Removed **${amount}** coins from ${target.username}.  
      New balance: **${newBalance}**`
    );
  },
};
