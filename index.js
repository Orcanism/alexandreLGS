const Discord = require('discord.js');
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});
const fs = require('fs');
const https = require('https');
const jsdom = require('jsdom');

const config = require('./config.json');
const private = require('./private.json');
const pick4meList = require('./pick4meList.json');
const championBuildList = require('./championBuildList.json');
const { resolve } = require('path');

client.login(private.token);

async function httpsGet(url, callback) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            callback(response);
            resolve();
        });
    });
}

// Fonction getRandomInt, permet de récupérer un nombre entier aléatoire strictement inférieur a max
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// Fonction normalizeChampionBuildList, permet de normaliser le nom des champions pour la commande build
function normalizeChampionBuildList(str) {
	let champion = str.toLowerCase()
		.replace(/\./g, "")
		.replace(/\'/g, "")
		return champion;
}

// Liste lolRole, liste les roles jouable sur League of Legends
const lolRoleList = ['top','jungle','mid','adc','support'];

// Liste serverList, liste les serveurs de league of legends
const serverList = ['BR1','EUN1','EUW1','JP1','KR','LA1','LA2','NA1','OC1','RU','TR1'];


client.on('ready', () => {
	console.log('Alexandre is ready !');
});

client.on('messageCreate', msg => {
	if (msg.author.bot) return; // Ne prends pas en compte les messages venant de bot

	// Vérifie que le message débute avec le préfixe
	if (msg.channel.type !== "dm" && !msg.author.bot) {
		let args = null;

		// Separe le préfixe, la commande et les arguments dans des variables différentes
		if (msg.content.startsWith(config.prefix)) {
			args = msg.content.slice(config.prefix.length).split(' ');

			cmd = args.shift().toLowerCase();

			// Commande test, permet de tester les choses qui ont besoin d'être testées
			if (cmd === 'test') {
			}

			// Commande ping, envoi le ping du bot en milliseconde
			else if (cmd === 'ping') {
				msg.channel.send('J\'ai ' + client.ws.ping + ' ms de latence');
				console.log(client.ws.ping + ' ms');
			}

            // breaks the code if removed
            else if (cmd === 'testtest') {
                msg.channel.send('salut')
            }
            
            else if (cmd === 'nationalite') {
                msg.channel.send('je suis Macédonien, mais pschhht, ne dit rien à Mousse');
            }
		}
	}
});