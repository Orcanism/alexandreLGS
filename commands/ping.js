const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Envoie le ping du bot',

    async run(client, msg, args, author) {
        await msg.reply(`J'ai ${client.ws.ping} ms de latence`);
    }
}