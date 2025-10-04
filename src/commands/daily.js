const { getBalance, addBalance, setLastDaily } = require("../utils/db");

module.exports = {
  name: "daily",
  async execute(message) {
    const bal = await getBalance(message.author.id);
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24h
    if (bal.last_daily && now - new Date(bal.last_daily).getTime() < cooldown) {
      const remaining = cooldown - (now - new Date(bal.last_daily).getTime());
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      return message.reply(`⏳ You can claim daily again in **${hours}h ${minutes}m**`);
    }

    const reward = Math.floor(Math.random() * 901) + 100; // 100–1000
    await addBalance(message.author.id, reward);
    await setLastDaily(message.author.id, now);

    message.reply(`🎁 You claimed your daily reward of **${reward.toLocaleString("en-US")} Fundra Currency**!`);
  },
};
