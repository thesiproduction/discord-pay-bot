const { getBalance } = require("../utils/db");

module.exports = {
  name: "balance",
  description: "Check your Fundra Currency balance",
  async execute(message) {
    const bal = await getBalance(message.author.id);
    message.reply(`💰 You have **${bal} FC** (Fundra Currency)`);
  },
};
