const { getBalance } = require('../utils/db');

module.exports = {
  name: 'balance',
  async execute(message) {
    const userId = message.author.id;
    let balance = await getBalance(userId);

    if (!balance) balance = 0; // prevent undefined

    message.reply(`💰 Your balance: **${balance.toLocaleString()} Fundra Currency**`);
  }
};
