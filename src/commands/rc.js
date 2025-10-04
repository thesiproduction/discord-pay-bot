const { getBalance, setBalance } = require("../utils/db");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "rc",
  async execute(message, args) {
    const bet = parseInt(args[0]);
    if (isNaN(bet) || bet <= 0) return message.reply("⚠️ Usage: fd rc <amount>");

    const bal = await getBalance(message.author.id);
    if (bal.amount < bet) return message.reply("❌ You don't have enough Fundra Currency!");

    // Pick 2 winning numbers (1–10)
    const card1 = Math.floor(Math.random() * 10) + 1;
    const card2 = Math.floor(Math.random() * 10) + 1;
    const hidden = [card1, card2];

    const row = new ActionRowBuilder().addComponents(
      ...Array.from({ length: 10 }, (_, i) =>
        new ButtonBuilder()
          .setCustomId(`guess_${i + 1}`)
          .setLabel(`${i + 1}`)
          .setStyle(ButtonStyle.Primary)
      )
    );

    const msg = await message.reply({
      content: "🎲 **Guess a card between 1–10!**",
      components: [row],
    });

    const filter = (i) => i.user.id === message.author.id;
    try {
      const interaction = await msg.awaitMessageComponent({ filter, time: 15000 });

      const guess = parseInt(interaction.customId.split("_")[1]);
      let result;
      if (hidden.includes(guess)) {
        await setBalance(message.author.id, bal.amount + bet);
        result = `🎉 Correct! You won **${bet.toLocaleString("en-US")}**.`;
      } else {
        await setBalance(message.author.id, bal.amount - bet);
        result = `😢 Wrong! You lost **${bet.toLocaleString("en-US")}**.`;
      }

      await interaction.update({
        content: `🃏 Hidden cards were **${card1}** and **${card2}**\n${result}`,
        components: [],
      });
    } catch {
      await msg.edit({ content: "⌛ Time’s up!", components: [] });
    }
  },
};
