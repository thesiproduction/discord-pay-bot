const { EmbedBuilder } = require("discord.js");
const db = require("../db");

module.exports = {
  name: "rc",
  description: "Play the random card guessing game (easier version)",
  async execute(message, args) {
    const userId = message.author.id;
    const bet = parseInt(args[0]);

    if (isNaN(bet) || bet <= 0) {
      return message.reply("⚠️ Please enter a valid bet amount!");
    }

    let balance = await db.getBalance(userId);
    if (balance < bet) {
      return message.reply("❌ You don’t have enough balance for this bet!");
    }

    // Shuffle animation
    const shuffleEmbed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("🔮 Shuffling the cards...")
      .setDescription("Numbers are flashing quickly between 1–10...");

    const msg = await message.channel.send({ embeds: [shuffleEmbed] });

    setTimeout(async () => {
      // Real card
      const card = Math.floor(Math.random() * 10) + 1;
      const group = card % 2 === 0 ? [2, 4, 6, 8, 10] : [1, 3, 5, 7, 9];

      const resultEmbed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("🎴 Guess the card!")
        .setDescription(
          `The hidden card is among these numbers: **${group.join(
            ", "
          )}**\n\nType your guess in chat!`
        );

      await msg.edit({ embeds: [resultEmbed] });

      // Collect user guess
      const filter = (m) =>
        m.author.id === message.author.id &&
        group.includes(parseInt(m.content));

      const collector = message.channel.createMessageCollector({
        filter,
        time: 15000,
        max: 1,
      });

      collector.on("collect", async (m) => {
        const guess = parseInt(m.content);

        if (guess === card) {
          await db.addBalance(userId, bet * 2); // Win 2x total
          balance += bet * 2;
          return message.reply(
            `✅ Correct! The card was **${card}**. You won **${bet * 2} FC**! New Balance: ${balance} FC`
          );
        } else {
          await db.addBalance(userId, -bet);
          balance -= bet;
          return message.reply(
            `❌ Wrong! The card was **${card}**. You lost **${bet} FC**. New Balance: ${balance} FC`
          );
        }
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          message.reply("⌛ You didn’t guess in time!");
        }
      });
    }, 2000);
  },
};
