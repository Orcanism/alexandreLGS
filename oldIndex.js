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

            else if (cmd === 'testtest') {
                msg.channel.send('salut')
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

            // Commande update, update la version du jeu (pour le moment)
			else if (cmd === 'update') {
                let link = {host: 'ddragon.leagueoflegends.com', path: '/api/versions.json'};
                httpsGet(link, res => {
                    let html = '';
                    res.on('data', chunk => {
                        html += chunk;
                    });
                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            let htmlDOM = new jsdom.JSDOM(html);
                            let document = htmlDOM.window.document;
                            config.currentVersion = JSON.parse(document.firstChild.lastChild.firstChild.textContent)[0];
                            let configPush = JSON.stringify(config, null, 4);
                            fs.writeFile('./config.json', configPush, () => console.error);
                        }
                        else if (res.statusCode !== 200) {
                            msg.channel.send('L\'erreur ' + res.statusCode + ' est survenue. Veuillez réessayer');
                        }
                    })
                })
                link = {host: 'ddragon.leagueoflegends.com', path: '/cdn/' + config.currentVersion + '/data/en_US/champion.json'};
                httpsGet(link, res => {
                    let html = '';
                    res.on('data', chunk => {
                        html += chunk;
                    });
                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            let htmlDOM = new jsdom.JSDOM(html);
                            let document = htmlDOM.window.document;
                            pick4meList.champions = Object.keys(JSON.parse(document.firstChild.lastChild.firstChild.textContent).data);
                            let pick4meListPush = JSON.stringify(pick4meList, null, 4);
                            fs.writeFile('./pick4meList.json', pick4meListPush, () => console.error);
                        }
                        else if (res.statusCode !== 200) {
                            msg.channel.send('L\'erreur ' + res.statusCode + ' est survenue. Veuillez réessayer');
                        }
                    })
                })

                msg.channel.send('Je suis désormais à jour !');
            }

            else if (cmd === 'summoner') {
                if (args.length > 0) {
                    let serverName = 'EUW1';
                    let route = 'europe';
                    let argsContainsServerName = false;
                    let leagueUsername = '';
                    for (let i = 0; i < serverList.length; i++) { 
                        if (args[0].toUpperCase() == serverList[i]) {
                            switch (args[0].toUpperCase()) {
                                case 'BR1':
                                    route = 'americas';
                                    break;
                                case 'LA1':
                                    route = 'americas';
                                    break;
                                case 'LA2':
                                    route = 'americas';
                                    break;
                                case 'NA1':
                                    route = 'americas';
                                    break;
                                case 'JP1':
                                    route = 'asia';
                                    break;
                                case 'KR':
                                    route = 'asia';
                                    break;
                                case 'OC1':
                                    route = 'sea';
                                    break;
                                default:
                                    break;
                            }
                            serverName = serverList[i];
                            argsContainsServerName = true;
                        }    
                    }
                    if (argsContainsServerName) {
                        for (let i = 1; i < args.length; i++) { 
                            leagueUsername += args[i] + '%20';
                        }
                    }  
                    else {
                        for (let i = 0; i < args.length; i++) { 
                            leagueUsername += args[i] + '%20';
                        }
                    } 
                    leagueUsername = leagueUsername.slice(0, leagueUsername.length - 3);
                    let link = {host: serverName + '.api.riotgames.com', path: '/lol/summoner/v4/summoners/by-name/' + leagueUsername + '?api_key=' + private.apiKey};
                    let puuid = 'yousk';
                    let level = 'yousk';
                    let lastTwentyGames = [];
                    httpsGet(link, res => {
                        let html = '';
                        res.on('data', chunk => {
                            html += chunk;
                        });
                        res.on('end', () => {
                            if (res.statusCode === 200) {
                                let htmlDOM = new jsdom.JSDOM(html);
                                let document = htmlDOM.window.document;
                                puuid = JSON.parse(document.firstChild.lastChild.firstChild.textContent).puuid;
                                level = JSON.parse(document.firstChild.lastChild.firstChild.textContent).summonerLevel;
                            }
                            else if (res.statusCode !== 200) {
                                msg.channel.send('L\'erreur ' + res.statusCode + ' est survenue. Veuillez réessayer');
                            }
                        })
                    // BUG, execute le .then() meme si la requete https ne passe pas
                    }).then(() => {
                        link = {host: route + '.api.riotgames.com', path: '/lol/match/v5/matches/by-puuid/' + puuid + '/ids?start=0&count=20&api_key=' + private.apiKey};
                        httpsGet(link, res => {
                            let html = '';
                            res.on('data', chunk => {
                                html += chunk;
                            });
                            res.on('end', () => {
                                if (res.statusCode === 200) {
                                    let htmlDOM = new jsdom.JSDOM(html);
                                    let document = htmlDOM.window.document;
                                    lastTwentyGames = JSON.parse(document.firstChild.lastChild.firstChild.textContent);
                                }
                                else if (res.statusCode !== 200) {
                                    msg.channel.send('L\'erreur ' + res.statusCode + ' est survenue. Veuillez réessayer');
                                }
                            })
                        }).then(() => {
                            console.log(lastTwentyGames);
                            // La suite ce sera ici :D
                            msg.channel.send('c\'est pas fini :)');
                        })
                    })
                }
                else {
                    msg.channel.send('la commande comporte trop peu d\'arguments');
                }
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
            
            else if (cmd === 'nationalite') {
                msg.channel.send('je suis Macédonien, mais pschhht, ne dit rien à Mousse');
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