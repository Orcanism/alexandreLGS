const Discord = require('discord.js');

module.exports = {
    name: 'credit',
    description: 'Envoie les crédits du bot',

    async run(client, msg, args, author) {
        msg.reply('Mes parents sont: <@319851824872030209> et <@626436514502541312>');
    }
}