const { getBalance, addBalance, getLastDaily, setLastDaily } = require("../db");

module.exports = {
  name: "daily",
  description: "Claim your daily reward (once every 24 hours)",
  async execute(message) {
    const userId = message.author.id;

    // Check last claim
    const lastClaim = await getLastDaily(userId);
    const now = new Date();

    if (lastClaim) {
      const diff = now - new Date(lastClaim); // ms difference
      if (diff < 24 * 60 * 60 * 1000) {
        const hours = Math.floor((24 * 60 * 60 * 1000 - diff) / (1000 * 60 * 60));
        return message.reply(`⏳ You already claimed your daily! Try again in ${hours} hours.`);
      }
    }

    // Generate random reward between 100–1000
    const reward = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

    // Add balance
    await addBalance(userId, reward);

    // Update last claim
    await setLastDaily(userId);

    return message.reply(`🎁 You claimed your daily reward of **${reward} Fundra Currency**!`);
  },
};
