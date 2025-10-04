const { getBalance, addBalance, removeBalance } = require('../utils/db');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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

    // deduct bet
    await removeBalance(userId, amount);

    // prepare game
    const hiddenNumber = Math.floor(Math.random() * 10) + 1;
    const winNumber = Math.floor(Math.random() * 10) + 1;

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('pick')
          .setLabel('Reveal Card')
          .setStyle(ButtonStyle.Primary)
      );

    const gameMessage = await message.reply({
      content: `🎴 A card is hidden between **1 - 10**.\nPress the button to reveal if you win!`,
      components: [row]
    });

    const filter = (interaction) => interaction.user.id === userId;
    const collector = gameMessage.createMessageComponentCollector({ filter, time: 15000, max: 1 });

    collector.on('collect', async (interaction) => {
      if (!interaction.isButton()) return;

      if (hiddenNumber === winNumber) {
        const winnings = amount * 2;
        await addBalance(userId, winnings);
        return interaction.update({
          content: `🎉 The hidden card was **${hiddenNumber}**!\n✅ You guessed correctly and won **${winnings} FC**!`,
          components: []
        });
      } else {
        return interaction.update({
          content: `😢 The hidden card was **${hiddenNumber}**.\n❌ You lost your bet of **${amount} FC**.`,
          components: []
        });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        gameMessage.edit({ content: '⌛ Time ran out! You lost your bet.', components: [] });
      }
    });
  }
};
