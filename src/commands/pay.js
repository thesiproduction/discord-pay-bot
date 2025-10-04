module.exports = {
  name: "pay",
  description: "Pay someone with fake currency",
  async execute(client, message, args) {
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target) return message.reply("⚠️ Please mention someone to pay. Example: `fd pay @user 10`");
    if (isNaN(amount) || amount <= 0) return message.reply("⚠️ Enter a valid amount. Example: `fd pay @user 10`");

    // Example balance logic (replace with your DB if you want real balances)
    return message.reply(`💸 You paid ${target.username} ${amount} coins!`);
  },
};
