const { getBalance } = require("../utils/db");

module.exports = {
  name: "balance",
  description: "Check your Fundra Currency balance",
  async execute(message, args) {
    const balance = await getBalance(message.author.id);

    if (balance === null) {
      await message.reply("⚠️ Error fetching your balance. Try again later.");
    } else {
      await message.reply(
        `💰 Your balance: **${balance} Fundra Currency**`
      );
    }
  },
};
