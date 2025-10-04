const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Displays payment instructions"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle("💳 Payment Instructions")
      .setDescription("Please pay using the details below:\n\n**UPI ID:** example@upi\n**Amount:** ₹100\n\nAfter payment, use `/paid` to confirm.")
      .setFooter({ text: "Thank you for your support!" });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
