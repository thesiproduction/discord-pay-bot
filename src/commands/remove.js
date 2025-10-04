const { removeBalance } = require("../utils/db");

const ADMINS = ["YOUR_DISCORD_USER_ID"]; // replace with your ID(s)

module.exports = {
  name: "remove",
  async execute(message, args) {
    if (!ADMINS.includes(message.author.id)) {
      return message.reply("❌ You are not authorized to use this command.");
    }

    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target || isNaN(amount)) {
      return message.reply("Usage: fd remove @user <amount>");
    }

    await removeBalance(target.id, amount);
    message.reply(`❌ Removed **${amount.toLocaleString("en-US")} Fundra Currency** from ${target.username}.`);
  },
};
