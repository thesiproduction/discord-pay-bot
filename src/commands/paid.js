const { SlashCommandBuilder } = require("discord.js");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

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

    // Insert into Supabase
    const { data, error } = await supabase.from("payments").insert([
      { name, email, screenshot_url: screenshot.url }
    ]);

    if (error) {
      console.error(error);
      return interaction.reply({ content: "❌ Failed to save payment data.", ephemeral: true });
    }

    await interaction.reply({ content: `✅ Payment recorded for **${name}**. We'll review your proof shortly.`, ephemeral: true });
  }
};
