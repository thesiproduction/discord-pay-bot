const { getBalance } = require('../utils/db');

module.exports = {
  name: 'balance',
  description: 'Check your balance',
  async execute(message) {
    const userId = message.author.id;
    const balance = await getBalance(userId);
    message.reply(`💰 Your balance: ${balance} Fundra Currency`);
  },
};
