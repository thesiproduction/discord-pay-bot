const { EmbedBuilder } = require("discord.js");
const db = require("../db.js"); // ✅ Correct path

module.exports = {
  name: "rc",
  description: "Play the RC (Random Card) game!",
  async execute(message, args) {
    const userId = message.author.id;
    const bet = parseInt(args[0]);

    if (!bet || isNaN(bet) || bet <= 0) {
      return message.reply("❌ Please enter a valid bet amount.");
    }

    // Get balance
    const balance = await db.getBalance(userId);
    if (balance < bet) {
      return message.reply("❌ You don't have enough balance to play.");
    }

    // Decide if the hidden card will be odd or even
    const card = Math.floor(Math.random() * 10) + 1; // 1–10
    const type = card % 2 === 0 ? "even" : "odd"; // what card actually is
    const shownNumbers = type === "even" ? [2, 4, 6, 8, 10] : [1, 3, 5, 7, 9];

    // Ask player to guess
    const embed = new EmbedBuilder()
      .setTitle("🎴 RC Game")
      .setDescription(
        `I’ve hidden a card between **1–10**.\nIt’s among these: **${shownNumbers.join(
          ", "
        )}**.\n\n👉 Type your guess (**one number from the list**) within 15s.`
      )
      .setColor("Random");

    await message.reply({ embeds: [embed] });

    // Collect player response
    const filter = (m) =>
      m.author.id === userId &&
      !isNaN(m.content) &&
      shownNumbers.includes(parseInt(m.content));

    message.channel
      .awaitMessages({ filter, max: 1, time: 15000, errors: ["time"] })
      .then(async (collected) => {
        const guess = parseInt(collected.first().content);

        let resultMsg;
        if (guess === card) {
          await db.addBalance(userId, bet * 2);
          resultMsg = `🎉 Correct! The card was **${card}**. You won **${(
            bet * 2
          ).toLocaleString()}** coins!`;
        } else {
          await db.addBalance(userId, -bet);
          resultMsg = `😢 Wrong! The card was **${card}**. You lost **${bet.toLocaleString()}** coins.`;
        }

        message.channel.send(resultMsg);
      })
      .catch(() => {
        message.reply("⌛ Time’s up! You didn’t respond in time.");
      });
  },
};
