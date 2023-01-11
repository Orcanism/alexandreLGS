const Discord = require('discord.js');

module.exports = {
    name: 'papagei',
    description: 'Répète le message que vous souhaitez',
    options: [
        {
            type: 'string',
            name: 'phrase',
            description: 'Phrase à répéter',
            required: true
        }
    ],

    async run(client, msg, args, author) {
        msg.channel.send(args._hoistedOptions[0].value);
        msg.reply({content: 'Voilà pour toi !', ephemeral: true});
    }
}