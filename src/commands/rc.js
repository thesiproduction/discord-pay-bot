const { EmbedBuilder } = require("discord.js");
const db = require("../utils/db.js"); // ✅ fixed path

module.exports = {
  name: "rc",
  description: "Random Card game. Double your bet if you guess right!",
  async execute(message, args) {
    const userId = message.author.id;
    const bet = parseInt(args[0]);

    if (isNaN(bet) || bet <= 0) {
      return message.reply("❌ Please provide a valid bet amount.");
    }

    const balance = db.getBalance(userId);
    if (balance < bet) {
      return message.reply("❌ You don't have enough balance to play.");
    }

    // Deduct the bet first
    db.addBalance(userId, -bet);

    // Choose odd or even numbers
    const type = Math.random() < 0.5 ? "odd" : "even";
    const numbers = type === "odd" ? [1, 3, 5, 7, 9] : [2, 4, 6, 8, 10];
    const hiddenCard = numbers[Math.floor(Math.random() * numbers.length)];

    const embed = new EmbedBuilder()
      .setTitle("🎴 Random Card Game")
      .setDescription(
        `A card is hidden!\n\n🔢 It is one of these **${type.toUpperCase()} numbers**: \`${numbers.join(
          ", "
        )}\`\n\nType the number you think it is!`
      )
      .setColor("Random");

    await message.channel.send({ embeds: [embed] });

    // Collect user guess
    const filter = (m) =>
      m.author.id === userId && !isNaN(m.content) && numbers.includes(parseInt(m.content));
    const collector = message.channel.createMessageCollector({
      filter,
      time: 15000,
      max: 1,
    });

    collector.on("collect", (m) => {
      const guess = parseInt(m.content);

      if (guess === hiddenCard) {
        const winnings = bet * 2;
        db.addBalance(userId, winnings);
        message.channel.send(
          `🎉 Correct! The hidden card was **${hiddenCard}**.\nYou won 💰 **${winnings.toLocaleString()}**!`
        );
      } else {
        message.channel.send(
          `❌ Wrong! The hidden card was **${hiddenCard}**.\nYou lost your bet of 💸 **${bet.toLocaleString()}**.`
        );
      }
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        message.channel.send("⌛ Time’s up! You didn’t make a guess.");
      }
    });
  },
};
