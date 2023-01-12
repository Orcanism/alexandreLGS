const Discord = require('discord.js');
const pick4meList = require('../pick4meList.json');

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
    name: 'pick4me',
    description: 'Propose un champion et build aléatoire pour League Of Legends',

    async run(client, msg, args, author) {
        let rdmChampion = getRandomInt(pick4meList.champions.length);
        let rdmRune = getRandomInt(pick4meList.runes.length);
        let rdmItem = getRandomInt(pick4meList.items.length);
        let championString = pick4meList.champions[rdmChampion];
        let runeString = pick4meList.runes[rdmRune];
        let itemString = pick4meList.items[rdmItem];
        msg.reply(`Aujourd\'hui, tu vas jouer **${championString}** avec la Rune **${runeString}** et avec comme Item mythic, **${itemString}**`);
    }
}