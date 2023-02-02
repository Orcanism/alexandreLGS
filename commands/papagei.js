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
        let messageToSend = '';
        let messageToSendList = args._hoistedOptions[0].value.split('|');
        for (let i = 0; i < messageToSendList.length; i++) {
            messageToSend += messageToSendList[i] + '\n';   
        }
        msg.channel.send(messageToSend);
        msg.reply({content: 'Voilà pour toi !', ephemeral: true});
    }
}