const { SlashCommandBuilder } = require("discord.js");
const { getBalance } = require("../utils/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your Fundra currency balance"),

  async execute(interaction) {
    const balance = await getBalance(interaction.user.id);

    if (balance === null) {
      await interaction.reply("⚠️ Error fetching your balance. Try again later.");
    } else {
      await interaction.reply(
        `💰 Your balance: **${balance} Fundra Currency**`
      );
    }
  },
};
