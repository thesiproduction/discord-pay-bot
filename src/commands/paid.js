const { SlashCommandBuilder } = require("discord.js");
const pool = require("../../db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("paid")
    .setDescription("Confirm payment")
    .addStringOption(option =>
      option.setName("name").setDescription("Your name").setRequired(true))
    .addStringOption(option =>
      option.setName("email").setDescription("Your email").setRequired(true))
    .addAttachmentOption(option =>
      option.setName("screenshot").setDescription("Upload payment screenshot").setRequired(true)),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const email = interaction.options.getString("email");
    const screenshot = interaction.options.getAttachment("screenshot");

    try {
      const query = `
        INSERT INTO payments (name, email, screenshot_url, created_at)
        VALUES ($1, $2, $3, NOW())
      `;
      await pool.query(query, [name, email, screenshot.url]);

      await interaction.reply({
        content: `✅ Payment recorded for **${name}**. We'll review your proof shortly.`,
        ephemeral: true
      });
    } catch (err) {
      console.error("DB Error:", err);
      await interaction.reply({
        content: "❌ Failed to save payment data.",
        ephemeral: true
      });
    }
  }
};
