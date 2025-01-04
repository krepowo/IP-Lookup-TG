const Telegram = require('node-telegram-bot-api');
const config = require('../config');
const { glob } = require('glob');
const { promisify } = require('util');

const client = new Telegram(config.TOKEN, {
    polling: true
});
const globPromise = promisify(glob);

client.commands = new Map();

const handler = async () => {
    const commandFiles = await globPromise(`${process.cwd()}/src/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
            if (file.name !== 'start') {
                client.setMyCommands([{ command: file.name, description: file.description }]);
            }
        }
    });

    const eventFiles = await globPromise(`${process.cwd()}/src/events/**/*.js`);
    eventFiles.map((value) => {
        require(value);
    });
};

handler();

module.exports = { client };