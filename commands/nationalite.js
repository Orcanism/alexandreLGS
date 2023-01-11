const Discord = require('discord.js');

module.exports = {
    name: 'nationalite',
    description: 'Envoie la "nationalité" ',

    async run(client, msg, args, author) {
        msg.reply('Je suis Macédonien, mais pschhht, ne dit rien à Mousse');
    }
}