const Discord = require('discord.js');

module.exports = {
    name: 'rule',
    description: 'Affiche l\'une des règles du serveur',
    options: [
        {
            type: 'number',
            name: 'rule_number',
            description: 'Numéro correspondant a la règle',
            required: true
        }
    ],

    async run(client, msg, args, author) {
        switch (args._hoistedOptions[0].value) {
            case 1:
                msg.reply('Ne pourchasser jamais un Singed !');
                break;
            case 2:
                msg.reply('Si l\'un de ces champions est votre main, vous vous en prendrez plein la gueule par les membres de ce serveur ! \n **Ekko (Mid), Fizz, Master Yi, Teemo, Vayne (Top), Warwick, Yasuo, Yone, Yuumi**');
                break;
            case 3:
                msg.reply('Tout conflit doit être réglé par un <#1014611950568734851>');
                break;
            case 4:
                msg.reply('Ne défier jamais <@319851824872030209> en 1v1 Vel\'Koz ! C\'est à vos risques et périls');
                break;
            case 34:
                msg.reply('https://rule34.xxx/index.php?page=post&s=list&tags=league_of_legends');
                break;
            default:
                msg.reply({content: 'Cette règle n\'éxiste pas, les règles existante sont : 1, 2, 3, 4, 34 !', ephemeral: true});
                break;
        }
    }
}