const { addBalance, canClaimDaily, updateDaily } = require('../utils/db');

module.exports = {
  name: 'daily',
  description: 'Claim your daily reward',
  async execute(message) {
    const userId = message.author.id;

    const { allowed } = await canClaimDaily(userId);
    if (!allowed) {
      return message.reply("⏳ You already claimed your daily reward. Try again in 24 hours.");
    }

    const reward = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    await addBalance(userId, reward);
    await updateDaily(userId);

    message.reply(`🎉 You claimed your daily reward of **${reward} Fundra Currency**!`);
  },
};
