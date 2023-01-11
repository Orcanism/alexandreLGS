const Discord = require('discord.js');

// Selecteur de role
var row = new Discord.ActionRowBuilder().addComponents(
	new Discord.StringSelectMenuBuilder()
		.setCustomId('roleSelector')
		.setPlaceholder('Choisis ta sauce !')
		.addOptions([
			{emoji: '🍅', label: 'Knack ketchup', value: 'ketchup'},
			{emoji: '🥚', label: 'Knack mayonnaise', value: 'mayonnaise'},
			{emoji: '🧴', label: 'Knack moutarde', value: 'moutarde'},
			{emoji: '🇨🇳', label: 'Knack sauce chinoise', value: 'sauceChinoise'},
			{emoji: '⚪', label: 'Knack sauce blanche', value: 'sauceBlanche'},
			{emoji: '🍛', label: 'Knack sauce curry', value: 'sauceCurry'}
		])
)

module.exports = {
    name: 'optionsroles',
    description: 'Envoie le message avec le menu de selection de role',

    async run(client, msg, args, author) {
        msg.channel.send({content: 'Sélectionne l\'une de ces options pour choisir la sauce avec laquelle tu veux être mangé', components: [row]});
        msg.reply({content: 'Voilà pour toi !', ephemeral: true});
    }
}