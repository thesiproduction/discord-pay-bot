module.exports = {
  name: "test",
  description: "Simple test command",
  async execute(message, args) {
    message.reply("✅ Bot is alive and commands are working!");
  }
};

