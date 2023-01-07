const Discord = require('discord.js');
const client = new Discord.Client({intents:[
	Discord.Intents.FLAGS.GUILDS,
	Discord.Intents.FLAGS.GUILD_MESSAGES,
	Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Discord.Intents.FLAGS.GUILD_MEMBERS
]});
const fs = require('fs');
const https = require('https');
const jsdom = require('jsdom');
const cron = require('cron');

const config = require('./config.json');
const private = require('./private.json');
const memberStats = require('./memberStats.json');
const pick4meList = require('./pick4meList.json')
const { resolve } = require('path');
const { time } = require('console');
client.login(private.token);

const incorrectArgument = 'Les arguments saisis sont incorrects pour cette commande';

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

// Fonction getDateElements, donne l'année, le mois ou le jour
function getDateElements(fullDate, elementOfDate) {
	let dateElements = fullDate.split('/');
	if (elementOfDate === "day") {return dateElements[0];}
	else if (elementOfDate === "month") {return dateElements[1];}
	else if (elementOfDate === "year") {return dateElements[2];}
	else {interaction.reply({content: 'Ce n\'est pas une date !', ephemeral: true})}
}

// Fonction formatDate, renvoie la date du jour au format dd/mm/yyyy
function padTo2Digits(num) {return num.toString().padStart(2, '0');}
function formatDate(date) {
	return [
		padTo2Digits(date.getDate()),
	  	padTo2Digits(date.getMonth() + 1),
	  	date.getFullYear(),
	].join('/');
}

// Actions s'éxécutant au démarage du bot
client.on('ready', () => {
	console.log('Alexandre is ready !');
	let birthday = new cron.CronJob('0 30 09 * * *', action => {
		let hasBirthday = [];
		for (let i = 0; i < Object.keys(memberStats).length; i++) {
			let arrayKey = Object.keys(memberStats)[i];
			if (memberStats[arrayKey].hasOwnProperty('birthday')) {
				if (memberStats[arrayKey].birthday.slice(0,-5) == formatDate(new Date()).slice(0,-5)) {
					let age = formatDate(new Date()).slice(-4) - memberStats[arrayKey].birthday.slice(-4);
					hasBirthday.push(memberStats[arrayKey].username + '(' + age + ' ans)');
				}
			}
		}
		if (hasBirthday.length == 0) {
			return;
		}
		else if (hasBirthday.length == 1) {
			client.channels.cache.get('985210201424674890').send('@everyone Souhaitez tous un joyeux anniversaire à **' + hasBirthday[0] + '**');
		}
		else if (hasBirthday.length == 2) {
			client.channels.cache.get('985210201424674890').send('@everyone Souhaitez tous un joyeux anniversaire à **' + hasBirthday[0] + '** et à **' + hasBirthday[1] + '**');
		}
		else if (hasBirthday.length == 3) {
			client.channels.cache.get('985210201424674890').send('@everyone Souhaitez tous un joyeux anniversaire à **' + hasBirthday[0] + ', ' + hasBirthday[1] + '** et à **' + hasBirthday[2] + '**');
		}
	});
	birthday.start();
});

// Actions s'éxécutant lorsqu'un membre rejoint le serveur
client.on('guildMemberAdd', member => {
	// Envoi un message en mp au nouveau membre
	if (!memberStats.hasOwnProperty(member.id)) {
		memberStats[member.id] = {"username": member.displayName, "messageCount": 1, "firstJoinDate": formatDate(new Date())};
		let memberStatsPush = JSON.stringify(memberStats, null, 4);
		fs.writeFile("./memberStats.json", memberStatsPush, () => console.error);
		client.channels.cache.get('992797701299245206').send('l\'ajout du nouveau membre a memberStats a fonctionné');
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
	memberStats[msg.author.id].messageCount += 1;
	memberStats[msg.author.id].username = msg.author.username;
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
				msg.channel.send('Les commandes disponibles sont: \n - birthday\n - papagei\n - nationalite\n - rule\n - uwu\n - pick4me\n - meteo\n - leaderboard\n - me\n - credit');
			}

			// Commande optionsroles, envoie le message avec la lsite deroulante pour selectionner son role
			else if (cmd === 'optionsroles') {
				msg.channel.send({content: 'Sélectionne l\'une de ces options pour choisir la sauce avec laquelle tu veux être mangé', components: [row]});
			}

			// Commande ping, envoi le ping du bot en milliseconde
			else if (cmd === 'ping') {
				msg.channel.send('J\'ai ' + client.ws.ping + ' ms de latence');
				console.log(client.ws.ping + ' ms');
			}

			// Commande test, permet de tester les choses qui ont besoin d'être testées
			else if (cmd === 'test') {

			}

			// Commande testtest, la commande test pour bubu. !! breaks the code if removed !!
			else if (cmd === 'testtest') {
				msg.channel.send('salut')
			}

			// Commande birthday, permet d'editer sa date d'anniversaire dans le fichier memberStats
			else if (cmd === 'birthday') {
				if (args.length == 1) {
					let regex = new RegExp(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/gm);
					if (regex.test(args[0])) {
						memberStats[msg.author.id].birthday = args[0];
						let memberStatsPush = JSON.stringify(memberStats, null, 4);
						fs.writeFile("./memberStats.json", memberStatsPush, () => console.error);
						msg.channel.send('Votre anniversaire a bien été mis à jour !');
					}
					else {
						msg.channel.send('Le format de la date est incorrecte, le format demandé est : **dd/mm/yyyy**');
					}
				}
				else {
					msg.channel.send(incorrectArgument);
				}
			}

			// Commande papagei, repete le message envoyer par l'utilisateur
			else if (cmd === 'papagei') {
				if (args.length > 0) {
					msg.channel.send(args.join(' '));
				}
				else {
					msg.channel.send(incorrectArgument);
				}
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

			// Commande pick4me, choisis un build aleatoire pour league of legends
			else if (cmd === 'pick4me') {
                let rdmChampion = getRandomInt(pick4meList.champions.length);
                let rdmRune = getRandomInt(pick4meList.runes.length);
                let rdmItem = getRandomInt(pick4meList.items.length);
                let championString = pick4meList.champions[rdmChampion];
                let runeString = pick4meList.runes[rdmRune];
                let itemString = pick4meList.items[rdmItem];
                msg.channel.send('Aujourd\'hui, tu vas jouer **' + championString + '** avec la Rune **' + runeString + '** et avec comme Item mythic, **' + itemString + '**');
			}

			// Commande updatepick4me, met a jour la liste des champions pour la commande pick4me
			else if (cmd === 'updatepick4me') {
				let link = {host: 'liquipedia.net', path: '/leagueoflegends/Champions'};
				httpsGet(link, res => {
					let html = '';
					res.on('data', chunk => {
						html += chunk;
					});
					res.on('end', () => {
						if (res.statusCode === 200) {
							let htmlDOM = new jsdom.JSDOM(html);
							let document = htmlDOM.window.document;
							msg.channel.send('it worked');
						}
						else if (res.statusCode !== 200) {
							msg.channel.send('L\'erreur ' + res.statusCode + ' est survenue. Veuillez réessayer');
						}
					})
				})
			}

			// Commande leaderboard, envoie les 3 membres les plus actifs du serveur
			else if (cmd === 'leaderboard') {
				let leaderboardArray = [];
				for (let i = 0; i < Object.keys(memberStats).length; i++) {
					let arrayKey = Object.keys(memberStats)[i];
					leaderboardArray.push(memberStats[arrayKey]);
				}
				leaderboardArray = leaderboardArray.sort((a, b) => {
					if (b.messageCount < a.messageCount) {
					  	return -1;
					}
				}).slice(0, 4);
				let firstPlace = ':first_place: **- ' + leaderboardArray[0].username + '** avec **' + leaderboardArray[0].messageCount + '** messages !';
				let secondPlace = ':second_place: **- ' + leaderboardArray[1].username + '** avec **' + leaderboardArray[1].messageCount + '** messages !';
				let thirdPlace = ':third_place: **- ' + leaderboardArray[2].username + '** avec **' + leaderboardArray[2].messageCount + '** messages !';
				let fourthPlace = ':chocolate_bar: **- ' + leaderboardArray[3].username + '** avec **' + leaderboardArray[3].messageCount + '** messages !';
				msg.channel.send('Voici les knacks les plus actives du serveur !\n\n' + firstPlace + '\n' + secondPlace + '\n' + thirdPlace + '\n' + fourthPlace);
			}

			// Commande me, envoie les informations de l'utilisateur qui appelle la commande
			else if (cmd === 'me') {
				let authorMessageCount = memberStats[msg.author.id].messageCount;
				let authorFirstJoinDate = memberStats[msg.author.id].firstJoinDate;

				let dayOfJoin = getDateElements(authorFirstJoinDate, "day");
				let monthOfJoin = getDateElements(authorFirstJoinDate, "month") - 1;
				let yearOfJoin = getDateElements(authorFirstJoinDate, "year");

				let nowTime = new Date();
				let joinTime = new Date(yearOfJoin, monthOfJoin, dayOfJoin);
				let timeBetween = Math.round((nowTime.getTime() - joinTime.getTime()) / 86400000);
				let averageDayMessage = (authorMessageCount / timeBetween).toFixed(2);
				msg.channel.send('Tu as envoyé **' + authorMessageCount + '** messages et tu as rejoins le serveur pour la première fois le **' + authorFirstJoinDate + '** ce qui fait une moyenne de **' + averageDayMessage + '** message(s) par jour !');
			}

			// Commande credit, envoie les credits du bot
			else if (cmd === 'credit') {
				msg.channel.send('Mes parents sont: <@319851824872030209> et <@626436514502541312>');
			}
		}
	}
})