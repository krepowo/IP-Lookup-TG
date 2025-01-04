const { client } = require("..");

client.on('message', async (message) => {
    if (message.from.is_bot) return;
    if (!message.text) return;
    if (!message.text.startsWith('/')) return;

    const args = message.text.split(' ');
    const command = args.shift().substring(1).toLowerCase();
    const cmd = client.commands.get(command);

    if (!cmd) return;

    try {
        cmd.run(client, message, args);
    } catch (error) {
        console.error(error);
    }
});