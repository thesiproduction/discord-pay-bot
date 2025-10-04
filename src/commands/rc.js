const { getBalance, addBalance, removeBalance } = require('../utils/db');

module.exports = {
  name: 'rc',
  async execute(message, args) {
    const userId = message.author.id;
    const amount = parseInt(args[0]);

    if (!amount || isNaN(amount) || amount <= 0) {
      return message.reply('❌ Please provide a valid bet amount.');
    }

    const balance = await getBalance(userId);
    if (balance < amount) {
      return message.reply('💸 You don’t have enough coins to play.');
    }

    // deduct bet immediately
    await removeBalance(userId, amount);

    // hidden card
    const hiddenNumber = Math.floor(Math.random() * 10) + 1;

    // shuffle animation (fake cards)
    const shuffleMsg = await message.reply('🎴 Shuffling cards...');
    let count = 0;
    const shuffleInterval = setInterval(async () => {
      count++;
      const fakeNum = Math.floor(Math.random() * 10) + 1;
      await shuffleMsg.edit(`🎴 Shuffling... Card shows: **${fakeNum}**`);
      if (count >= 5) { // stop after 5 flips
        clearInterval(shuffleInterval);
        shuffleMsg.edit('🎴 Cards shuffled! Guess a number between **1–10** in the next 10 seconds.');
      }
    }, 1000);

    // collect user guess
    const filter = m => m.author.id === userId;
    const collector = message.channel.createMessageCollector({ filter, time: 10000, max: 1 });

    collector.on('collect', async (msg) => {
      const guess = parseInt(msg.content);
      if (!guess || guess < 1 || guess > 10) {
        return msg.reply('❌ Invalid guess! Must be a number between 1 and 10.');
      }

      if (guess === hiddenNumber) {
        const winnings = amount * 2;
        await addBalance(userId, winnings);
        msg.reply(`🎉 Correct! The hidden card was **${hiddenNumber}**.\n✅ You won **${winnings} FC**!`);
      } else {
        msg.reply(`😢 Wrong! The hidden card was **${hiddenNumber}**.\n❌ You lost your bet of **${amount} FC**.`);
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        message.reply(`⌛ Time ran out! The hidden card was **${hiddenNumber}**. You lost your bet of ${amount} FC.`);
      }
    });
  }
};
