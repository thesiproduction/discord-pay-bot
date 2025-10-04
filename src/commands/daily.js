const { addBalance, getLastDaily, setLastDaily, getBalance } = require('../utils/db');

module.exports = {
  name: 'daily',
  async execute(message) {
    const userId = message.author.id;
    const now = new Date();
    const lastDaily = await getLastDaily(userId);

    if (lastDaily) {
      const diff = now - new Date(lastDaily);
      const hours = 24 - Math.floor(diff / (1000 * 60 * 60));
      if (diff < 24 * 60 * 60 * 1000) {
        return message.reply(`⏳ You already claimed your daily reward! Come back in **${hours}h**.`);
      }
    }

    const reward = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    await addBalance(userId, reward);
    await setLastDaily(userId, now.toISOString());

    const newBalance = await getBalance(userId);

    message.reply(`🎁 You claimed your daily reward of **${reward} FC**!\n💰 New Balance: **${newBalance} FC**`);
  }
};
