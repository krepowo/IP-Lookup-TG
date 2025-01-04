module.exports = {
    name: 'start',
    run: async (client, message, args) => {
        client.sendMessage(message.chat.id, '👋 Hello there.\n\n📍 You can run `/lookup` to use this bot.', { parse_mode: 'Markdown' });
    }
};