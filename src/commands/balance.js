const { getBalance } = require("../utils/db");

module.exports = {
  name: "balance",
  async execute(message) {
    const bal = await getBalance(message.author.id);
    const formatted = bal.amount.toLocaleString("en-US");
    message.reply(`💰 Your balance: **${formatted} Fundra Currency**`);
  },
};
