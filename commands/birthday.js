const Discord = require('discord.js');
const fs = require('fs');

const memberStats = require('../memberStats.json');

module.exports = {
    name: 'birthday',
    description: 'Permet à Alexandre de connaitre votre date d\'anniversaire',
    options: [
        {
            type: 'string',
            name: 'date',
            description: 'Votre date d\'anniversaire',
            required: true
        }
    ],

    async run(client, msg, args, author) {
        let regex = new RegExp(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/gm);
        if (regex.test(args._hoistedOptions[0].value)) {
            memberStats[author.id].birthday = args._hoistedOptions[0].value;
            let memberStatsPush = JSON.stringify(memberStats, null, 4);
            fs.writeFile("./memberStats.json", memberStatsPush, () => console.error);
            msg.reply('Votre anniversaire a bien été mis à jour !');
        }
        else {
            msg.reply({content: 'Le format de la date est incorrecte, le format demandé est : **dd/mm/yyyy**', ephemeral: true});
        }
    }
}