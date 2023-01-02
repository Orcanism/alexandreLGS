const Discord = require('discord.js');
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});
const fs = require('fs');
const https = require('https');
const jsdom = require('jsdom');

const config = require('./config.json');
const private = require('./private.json');
const memberStats = require('./memberStats.json');
const pick4meList = require('./pick4meList.json')
const { resolve } = require('path');
client.login(private.token);

const incorrectArgument = 'Les arguments saisis sont incorrects pour cette commande';
const roleEmojis = {tomato: "Knack ketchup", egg: "Knack mayonnaise", squeeze_bottle: "Knack moutarde", flag_cn: "Knack sauce chinoise", white_circle: "Knack sauce blanche", curry: "Knack sauce curry"}

// Selecteur de role
var row = new Discord.MessageActionRow().addComponents(
	new Discord.MessageSelectMenu()
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

// Fonction httpsGet, permet de faire une requete https async
async function httpsGet(url, callback) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            callback(response);
            resolve();
        });
    });
}

// Fonction oldRoleRemover, retire l'ancien role de sauce de l'utilisateur
function oldRoleRemover(member) {
	// Enleve le ketchup
	if(member.roles.cache.has('992849670248341714')){
		member.roles.remove('992849670248341714');
	}
	// Enleve la mayonnaise
	if(member.roles.cache.has('1050446801817317496')){
		member.roles.remove('1050446801817317496');
	}
	// Enleve la moutarde
	if(member.roles.cache.has('992796420941811812')){
		member.roles.remove('992796420941811812');
	}
	// Enleve la sauce chinoise
	if(member.roles.cache.has('1057325637951569961')){
		member.roles.remove('1057325637951569961');
	}
	// Enleve la sauce blanche
	if(member.roles.cache.has('1054889587610243133')){
		member.roles.remove('1054889587610243133');
	}
	// Enleve la sauce curry
	if(member.roles.cache.has('1058383818823843870')){
		member.roles.remove('1058383818823843870');
	}
}

// Fonction getRandomInt, permet de récupérer un nombre entier aléatoire strictement inférieur a max
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// Actions s'éxécutant au démarage du bot
client.on('ready', () => {
	console.log('Alexandre is ready !');
});

// Actions s'éxécutant lorsqu'un membre rejoint le serveur
client.on('guildMemberAdd', member => {
	// Envoi un message en mp au nouveau membre
	if (!memberStats.hasOwnProperty(member.id)) {
		memberStats[member.id] = {"username": member.displayName, "messageCount": 0, "firstJoinDate": member.joinedAt};
		let memberStatsPush = JSON.stringify(memberStats, null, 4);
		fs.writeFile("./memberStats.json", memberStatsPush, () => console.error);
	}
});

client.on('interactionCreate', interaction => {
	if (interaction.isSelectMenu()) {
		if (interaction.customId === 'roleSelector') {
			if (!(interaction.member.roles.cache.has('992800118367600671') || interaction.member.roles.cache.has('1037380761327775744'))) {
				if (interaction.values == 'ketchup') {
					interaction.reply({content: 'Très bien, tu seras mangé avec du ketchup !', ephemeral: true});
					oldRoleRemover(interaction.member);
					interaction.member.roles.add('992849670248341714');
				}
				else if (interaction.values == 'mayonnaise') {
					interaction.reply({content: 'Très bien, tu seras mangé avec de la mayonnaise !', ephemeral: true});
					oldRoleRemover(interaction.member);
					interaction.member.roles.add('1050446801817317496');
				}
				else if (interaction.values == 'moutarde') {
					interaction.reply({content: 'Très bien, tu seras mangé avec de la moutarde !', ephemeral: true});
					oldRoleRemover(interaction.member);
					interaction.member.roles.add('992796420941811812');
				}
				else if (interaction.values == 'sauceChinoise') {
					interaction.reply({content: 'Très bien, tu seras mangé avec de la sauce chinoise !', ephemeral: true});
					oldRoleRemover(interaction.member);
					interaction.member.roles.add('1057325637951569961');
				}
				else if (interaction.values == 'sauceBlanche') {
					interaction.reply({content: 'Très bien, tu seras mangé avec de la sauce blanche !', ephemeral: true});
					oldRoleRemover(interaction.member);
					interaction.member.roles.add('1054889587610243133');
				}
				else if (interaction.values == 'sauceCurry') {
					interaction.reply({content: 'Très bien, tu seras mangé avec de la sauce curry !', ephemeral: true});
					oldRoleRemover(interaction.member);
					interaction.member.roles.add('1058383818823843870');
				}
			}
			else {
			interaction.reply({content: 'Tu ne peux pas choisir une autre sauce car tu es déjà parfait comme ça !', ephemeral: true});
			}
		}
	}
});

// Actions s'éxécutant lorsqu'un message est envoyé
client.on('messageCreate', msg => {
	if (msg.author.bot) return; // Ne prends pas en compte les messages venant de bot

	// Compteur de messages envoyés sur le serveur
	let idOfAuthor = msg.author.id;
	let authorMessageCount = memberStats[idOfAuthor].messageCount + 1;
	memberStats[idOfAuthor] = {"username": msg.author.username, "messageCount": authorMessageCount, "firstJoinDate": memberStats[idOfAuthor].firstJoinDate};
	
	let memberStatsPush = JSON.stringify(memberStats, null, 4);
	fs.writeFile("./memberStats.json", memberStatsPush, () => console.error);

	// Vérifie que le message débute avec le préfixe
	if (msg.channel.type !== "dm" && !msg.author.bot) {
		let args = null;

		// Separe le préfixe, la commande et les arguments dans des variables différentes
		if (msg.content.startsWith(config.prefix)) {
			args = msg.content.slice(config.prefix.length).split(' ');

			cmd = args.shift().toLowerCase();

			if (cmd === 'help') {
				msg.channel.send('Les commandes disponibles sont: \n - ping\n - papagei\n - nationalite\n - rule\n - uwu\n - pick4me\n - meteo\n - credit');
			}

			// Commande test, permet de tester les choses qui ont besoin d'être testées
			else if (cmd === 'test') {

			}

			// Commande testtest, la commande test pour bubu. !! breaks the code if removed !!
			else if (cmd === 'testtest') {
				msg.channel.send('salut')
			}

			else if (cmd === 'optionsroles') {
				msg.channel.send({content: 'Sélectionne l\'une de ces options pour choisir la sauce avec laquelle tu veux être mangé', components: [row]});
			}

			// Commande ping, envoi le ping du bot en milliseconde
			else if (cmd === 'ping') {
				msg.channel.send('J\'ai ' + client.ws.ping + ' ms de latence');
				console.log(client.ws.ping + ' ms');
			}

			// Commande papagei, repete le message envoyer par l'utilisateur
			else if (cmd === 'papagei') {
				msg.channel.send(args.join(' '));
			}

			// Commande nationalite, petit message pour trigger mousse
            else if (cmd === 'nationalite') {
                msg.channel.send('je suis Macédonien, mais pschhht, ne dit rien à Mousse');
            }

			// Commande rule, pour recevoir les règles du serveur
			else if (cmd === 'rule') {
				if (args.length == 1) {
					switch (args[0]) {
						case 'help':
 							msg.channel.send('Les règles existante sont : 1, 2, 3, 4, 34');
							break;
						case '1':
							msg.channel.send('Ne pourchasser jamais un Singed !');
							break;
						case '2':
							msg.channel.send('Si l\'un de ces champions est votre main, vous vous en prendrez plein la gueule par les membres de ce serveur ! \n **Ekko (Mid), Fizz, Master Yi, Teemo, Vayne (Top), Warwick, Yasuo, Yone, Yuumi**');
							break;
						case '3':
							msg.channel.send('Tout conflit doit être réglé par un <#1014611950568734851>');
							break;
						case '4':
							msg.channel.send('Ne défier jamais <@319851824872030209> en 1v1 Vel\'Koz ! C\'est à vos risques et périls');
							break;
						case '34':
							msg.channel.send('https://rule34.xxx/index.php?page=post&s=list&tags=league_of_legends');
							break;
						default:
							msg.channel.send('Cette règle n\'éxiste pas...');
							break;
					}
				}
				else {
					msg.channel.send(incorrectArgument);
				}
			}

			// Commande UwU, envoie une image de chat trop meugnon <3
			else if (cmd === 'uwu') {
				let link = {host: 'api.thecatapi.com', path: '/v1/images/search'};
				httpsGet(link, res => {
                    let html = '';
                    res.on('data', chunk => {
                        html += chunk;
                    });
                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            let htmlDOM = new jsdom.JSDOM(html);
                            let document = htmlDOM.window.document;
							msg.channel.send(JSON.parse(document.childNodes[0].childNodes[1].childNodes[0].textContent)[0].url);
                        }
                        else if (res.statusCode !== 200) {
                            msg.channel.send('L\'erreur ' + res.statusCode + ' est survenue. Veuillez réessayer');
                        }
                    })
                })
			}

			// Commande meteo, envoie la meteo de Skopje
			else if (cmd === 'meteo') {
				let link = {host: 'weather.com', path: '/fr-FR/temps/aujour/l/13d451840dce871fb7bd25fac368ff94bd3b30b8a2c74fe3285ec75851f54ddc'};
				httpsGet(link, res => {
                    let html = '';
                    res.on('data', chunk => {
                        html += chunk;
                    });
                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            let htmlDOM = new jsdom.JSDOM(html);
                            let document = htmlDOM.window.document;
							let temp = document.getElementsByClassName("CurrentConditions--primary--2DOqs")[0].childNodes[0].textContent;
							let sky = document.getElementsByClassName("CurrentConditions--primary--2DOqs")[0].childNodes[1].textContent.toLowerCase();
							msg.channel.send('À Skopje il fait **' + temp + '** avec un ciel **' + sky + '**');
                        }
                        else if (res.statusCode !== 200) {
                            msg.channel.send('L\'erreur ' + res.statusCode + ' est survenue. Veuillez réessayer');
                        }
                    })
                })
			}

			// Commande pick4me, picking random thing
			else if (cmd === 'pick4me') {
                let rdmChampion = getRandomInt(pick4meList.champions.length);
                let rdmRune = getRandomInt(pick4meList.runes.length);
                let rdmItem = getRandomInt(pick4meList.items.length);
                let championString = pick4meList.champions[rdmChampion];
                let runeString = pick4meList.runes[rdmRune];
                let itemString = pick4meList.items[rdmItem];
                msg.channel.send('Aujourd\'hui, tu vas jouer **' + championString + '** avec la Rune **' + runeString + '** et avec comme Item mythic, **' + itemString + '**');
			}			

			// Commande update, update la liste des champions, items et maybe runes A FINIR
			else if (cmd === 'updatepick4me') {
				msg.channel.send('bruh1');
				let link = {host: 'leagueoflegends.com', path: '/fr-fr/champions/'};
				httpsGet(link, res => {
                    let html = '';
                    res.on('data', chunk => {
                        html += chunk;
                    });
                    res.on('end', () => {
						msg.channel.send('bruh2');
                        if (res.statusCode === 302) {
							msg.channel.send('bruh3');
                            let htmlDOM = new jsdom.JSDOM(html);
                            let document = htmlDOM.window.document;
							let champ = document.getElementsByClassName("style__Text-n3ovyt-3 gMLOLF")[0];
							msg.channel.send('bruh4');
							msg.channel.send(champ + '\n');
                        }
                        else if (res.statusCode !== 200) {
                            msg.channel.send('L\'erreur ' + res.statusCode + ' est survenue. Veuillez réessayer');
                        }
                    })
                })
			}

			// Commande credit, envoie les credits du bot
			else if (cmd === 'credit') {
				msg.channel.send('Mes parents sont: <@319851824872030209> et <@626436514502541312>');
			}
		}
	}
})