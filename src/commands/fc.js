const { getBalance, setBalance } = require("../utils/db");

module.exports = {
  name: "fc",
  description: "Flip card game: fd fc <black|red> <amount>",
  async execute(message, args) {
    if (args.length < 2) {
      return message.reply("❌ Usage: `fd fc <black|red> <amount>`");
    }

    const choice = args[0].toLowerCase();
    const amount = parseInt(args[1]);
    if (!["black", "red"].includes(choice)) {
      return message.reply("❌ Choose either `black` or `red`.");
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply("❌ Enter a valid amount.");
    }

    const userId = message.author.id;
    let balance = await getBalance(userId);

    if (balance < amount) {
      return message.reply("❌ You don’t have enough FC.");
    }

    // Deduct upfront
    balance -= amount;
    await setBalance(userId, balance);

    // Animation
    await message.reply("🎴 Flipping the card...");
    await new Promise((r) => setTimeout(r, 2000));

    // Random result
    const result = Math.random() < 0.5 ? "black" : "red";

    let resultMsg = `🃏 The card is **${result.toUpperCase()}**!\n`;

    if (choice === result) {
      balance += amount * 2;
      resultMsg += `🎉 You won **${amount * 2} FC**!`;
    } else {
      resultMsg += `😢 You lost **${amount} FC**.`;
    }

    await setBalance(userId, balance);

    message.reply(`${resultMsg}\n💰 Your new balance: **${balance} FC**`);
  },
};
