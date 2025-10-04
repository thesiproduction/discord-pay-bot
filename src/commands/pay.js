const { getBalance, setBalance } = require('../utils/db');

module.exports = {
  name: 'pay',
  description: 'Pay another user',
  async execute(message, args) {
    const senderId = message.author.id;
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target) {
      return message.reply('❌ Please mention a valid user to pay.');
    }

    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ Please enter a valid amount.');
    }

    const senderBalance = await getBalance(senderId);

    if (senderBalance < amount) {
      return message.reply("💸 You don’t have enough coins.");
    }

    await setBalance(senderId, senderBalance - amount);
    const targetBalance = await getBalance(target.id);
    await setBalance(target.id, targetBalance + amount);

    message.reply(`✅ Paid ${amount} Fundra Currency to ${target.username}.`);
  },
};
