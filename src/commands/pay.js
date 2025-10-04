module.exports = {
  name: "pay",
  description: "Pay another user some coins",
  async execute(message, args, db) {
    const user = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!user || isNaN(amount)) {
      return message.reply("Usage: `fd pay @user <amount>`");
    }

    if (user.id === message.author.id) {
      return message.reply("❌ You cannot pay yourself.");
    }

    // TODO: replace this with real DB logic from db.js
    // Example with fake balance system
    let senderBalance = 100; // demo
    if (senderBalance < amount) {
      return message.reply("💸 You don’t have enough coins.");
    }

    // Deduct and add balance in DB here
    // await db.addBalance(user.id, amount);
    // await db.subtractBalance(message.author.id, amount);

    return message.reply(`✅ You paid ${amount} coins to ${user.username}!`);
  },
};
