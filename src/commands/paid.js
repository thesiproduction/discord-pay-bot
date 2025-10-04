module.exports = {
  name: "paid",
  description: "Check your balance",
  async execute(message, args, db) {
    // TODO: fetch from db.js
    let balance = 100; // demo, later replace with DB call

    return message.reply(`💰 You currently have ${balance} coins.`);
  },
};
