const Discord = require('discord.js');
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES]});
const fs = require('fs');
const https = require('https');
const jsdom = require('jsdom');

const config = require('./config.json');
const token = require('./token.json');
const pick4meList = require('./pick4meList.json');
const championBuildList = require('./championBuildList.json')

client.login(token.token);

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

client.on('ready', () => {
	console.log('Alexandre is ready !');
});

client.on('messageCreate', msg => {
	if (msg.author.bot) return; // Ne prends pas en compte les messages venant de bot

	// Vérifie que le message débute avec le préfixe
	if (msg.channel.type !== "dm" && !msg.author.bot) {
		checkPrefix = msg.content.startsWith(config.prefix);
		let args = null;

		// Separe le préfixe, la commande et les arguments dans des variables différentes
		if (checkPrefix) {
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

			// Commande pick4me, le bot donne un champion, une rune principale, et un item mythic aléatoire
			else if (cmd === 'pick4me') {
                let rdmChampion = getRandomInt(pick4meList.champion.length);
                let rdmRune = getRandomInt(pick4meList.rune.length);
                let rdmItem = getRandomInt(pick4meList.item.length);
                let championString = pick4meList.champion[rdmChampion];
                let runeString = pick4meList.rune[rdmRune];
                let itemString = pick4meList.item[rdmItem];
                msg.channel.send('Aujourd\'hui, tu vas jouer **' + championString + '** avec la Rune **' + runeString + '** et avec comme Item mythic, **' + itemString + '**');
			}

			// Commande build, envoie la page op.gg du champion demandé
			else if (cmd === 'build') {
                if (args.length > 0) {
                    let askedChampion = args[0];
                    let askedRole = args[(args.length - 1)];
                    for (i = 1; i < (args.length - 1); i++) {
                        askedChampion += args[i];
                    }
                    askedChampion = normalizeChampionBuildList(askedChampion);
                    if (!championBuildList['list'].includes(askedChampion)) {
                        msg.channel.send('Le nom du champion doit être éronné, ma base de donnée ne contient pas de champion avec ce nom');
                    }
                    else if (!lolRoleList.includes(askedRole)) {
                        msg.channel.send('Le role spécifié n\'exsite pas essayer avec l\'un de ces rôles : top, jungle, mid, adc, support');
                    }
                    else if (championBuildList['list'].includes(askedChampion)) {

                        // NEW CODE INCOMING WITH RITO'S API :BUBUPOG: :BUBUPOG: :BUBUPOG: :BUBUPOG: :BUBUPOG: :BUBUPOG:

                    }
				}
				else {
					msg.channel.send(wrongChannel);
				}
			}
		}
	}
});

/*  Embed text for the build command

let embed = {
    "title": "Build de @askedChampion",
    "description": "D'après op.gg, les meilleurs items et runes en ce moment sont :",
    "url": "@opggCompleteLink",
    "color": 3306490,
    "fields": [
        {
        "name": "Arbre Principal",
        "value": "@mainTree",
        "inline": true
        },
        {
        "name": "Arbre Secondaire",
        "value": "@secondaryTree",
        "inline": true
        },
        {
        "name": "Ordre des spells",
        "value": "@spellOrder"
        },
        {
        "name": "Item de départ",
        "value": "@startItem",
        "inline": true
        },
        {
        "name": "Item Mythique",
        "value": "@mythicItem",
        "inline": true
        },
        {
        "name": "Bottes",
        "value": "@boots",
        "inline": true
        },
        {
        "name": "Sorts d'invocateur",
        "value": "@sumSpell",
        },
        {
        "name": "Win Rate",
        "value": "@winRate",
        "inline": true
        },
        {
        "name": "Champion to ban",
        "value": "@champToBan",
        "inline": true
        }
    ]
}

embed.title = embed.title.replace('@askedChampion', askedChampion.charAt(0).toUpperCase() + askedChampion.substring(1));
embed.url = embed.url.replace('@opggCompleteLink',opggCompleteLink);
embed.fields[0].value = embed.fields[0].value.replace('@mainTree', mainTree);
embed.fields[1].value = embed.fields[1].value.replace('@secondaryTree', secondaryTree);
embed.fields[2].value = embed.fields[2].value.replace('@spellOrder', spellOrder);
embed.fields[3].value = embed.fields[3].value.replace('@startItem', startItem);
embed.fields[4].value = embed.fields[4].value.replace('@mythicItem', mythicItem);
embed.fields[5].value = embed.fields[5].value.replace('@boots', boots);
embed.fields[6].value = embed.fields[6].value.replace('@sumSpell', sumSpell);
embed.fields[7].value = embed.fields[7].value.replace('@winRate', winRate);
embed.fields[8].value = embed.fields[8].value.replace('@champToBan', champToBan);
*/