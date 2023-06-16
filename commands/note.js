const Discord = require('discord.js');
const https = require('https');
const jsdom = require('jsdom');

const private = require('../private.json');


module.exports = {
    name: 'note',
    description: 'Permet de vous noter vous et vos alliés sur une game en particulier des 14 derniers jours',
    options: [
        {
            type: 'string',
            name: 'summonername',
            description: 'Votre pseudonyme en jeu',
            required: true
        },
        {
            type: 'integer',
            name: 'gamenumber',
            description: 'antoine help me',
            required: true
        }
    ],

    async run(client, msg, args, author) {
        new Date()
        let memberPUUID = 'yousk2';
        let output = '';
        let matchList = [];
        let leaderboardArray = [];
        let statsName = [];
        let note = {};
        let dataCleaned = {};
        let memberIGN = args._hoistedOptions[0].value;
        let summonerV4LinkPath = `/lol/summoner/v4/summoners/by-name/${memberIGN.replace(' ', '%20')}?api_key=${private.apiKeyRiot}`;
        let summonerV4Link = {host: 'euw1.api.riotgames.com', path: summonerV4LinkPath};
        https.get(summonerV4Link, res => {
            let html = '';
            res.on('data', chunk => {
                html += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    let htmlDOM = new jsdom.JSDOM(html);
                    let document = htmlDOM.window.document;
                    memberPUUID = JSON.parse(document.children[0].textContent).puuid;

                    let matchV5LinkOnePath = `/lol/match/v5/matches/by-puuid/${memberPUUID}/ids?startTime=${Math.round(Date.now() / 1000 - 1209600)}&endTime=${Math.round(Date.now() / 1000)}&start=0&count=20&api_key=${private.apiKeyRiot}`;
                    let matchV5LinkOne = {host: 'europe.api.riotgames.com', path: matchV5LinkOnePath};
                    https.get(matchV5LinkOne, res => {
                        let html = '';
                        res.on('data', chunk => {
                            html += chunk;
                        });
                        res.on('end', () => {
                            if (res.statusCode === 200) {
                                let htmlDOM = new jsdom.JSDOM(html);
                                let document = htmlDOM.window.document;
                                matchList = JSON.parse(document.children[0].textContent);

                                let matchV5LinkTwoPath = `/lol/match/v5/matches/${matchList[args._hoistedOptions[1].value - 1]}?api_key=${private.apiKeyRiot}`;
                                let matchV5LinkTwo = {host: 'europe.api.riotgames.com', path: matchV5LinkTwoPath};
                                https.get(matchV5LinkTwo, res => {
                                    let html = '';
                                    res.on('data', chunk => {
                                        html += chunk;
                                    });
                                    res.on('end', () => {
                                        if (res.statusCode === 200) {
                                            let htmlDOM = new jsdom.JSDOM(html);
                                            let document = htmlDOM.window.document;
                                            let data = JSON.parse(document.children[0].textContent).info.participants;
                                            for (let i = 0; i < data.length; i++) {
                                                 dataCleaned[`${data[i].championName} (${data[i].summonerName})`] = {
                                                    "player": `${data[i].championName} (${data[i].summonerName})`,
                                                    "assists": data[i].assists,
                                                    "baronKills": data[i].baronKills,
                                                    "champExperience": data[i].champExperience,
                                                    "damageDealtToBuildings": data[i].damageDealtToBuildings,
                                                    "damageDealtToObjectives": data[i].damageDealtToObjectives,
                                                    "damageDealtToTurrets": data[i].damageDealtToTurrets,
                                                    "damageSelfMitigated": data[i].damageSelfMitigated,
                                                    "deaths": data[i].deaths,
                                                    "detectorWardsPlaced": data[i].detectorWardsPlaced,
                                                    "dragonKills": data[i].dragonKills,
                                                    "goldEarned": data[i].goldEarned,
                                                    "goldSpent": data[i].goldSpent,
                                                    "individualPosition": data[i].individualPosition,
                                                    "inhibitorKills": data[i].inhibitorKills,
                                                    "inhibitorTakedowns": data[i].inhibitorTakedowns,
                                                    "kills": data[i].kills,
                                                    "largestKillingSpree": data[i].largestKillingSpree,
                                                    "longestTimeSpentLiving": data[i].longestTimeSpentLiving,
                                                    "magicDamageDealt": data[i].magicDamageDealt,
                                                    "magicDamageDealtToChampions": data[i].magicDamageDealtToChampions,
                                                    "physicalDamageDealt": data[i].physicalDamageDealt,
                                                    "physicalDamageDealtToChampions": data[i].physicalDamageDealtToChampions,
                                                    "timeCCingOthers": data[i].timeCCingOthers,
                                                    "totalDamageDealt": data[i].totalDamageDealt,
                                                    "totalDamageDealtToChampions": data[i].totalDamageDealtToChampions,
                                                    "totalDamageShieldedOnTeammates": data[i].totalDamageShieldedOnTeammates,
                                                    "totalDamageTaken": data[i].totalDamageTaken,
                                                    "totalHeal": data[i].totalHeal,
                                                    "totalHealsOnTeammates": data[i].totalHealsOnTeammates,
                                                    "totalTimeSpentDead": data[i].totalTimeSpentDead,
                                                    "trueDamageDealt": data[i].trueDamageDealt,
                                                    "trueDamageDealtToChampions": data[i].trueDamageDealtToChampions,
                                                    "turretKills": data[i].turretKills,
                                                    "turretTakedowns": data[i].turretTakedowns,
                                                    "turretsLost": data[i].turretsLost,
                                                    "visionScore": data[i].visionScore,
                                                    "wardsKilled": data[i].wardsKilled,
                                                    "wardsPlaced": data[i].wardsPlaced,
                                                    "farm": data[i].neutralMinionsKilled + data[i].totalMinionsKilled,
                                                    "win": data[i].win
                                                }
                                            }
                                            for (let i = 0; i < Object.keys(dataCleaned).length; i++) {
                                                let arrayKey = Object.keys(dataCleaned)[i];
                                                note[Object.keys(dataCleaned)[i]] = 0;
                                                leaderboardArray.push(dataCleaned[arrayKey]);
                                            }
                                            for (let i = 0; i < Object.keys(leaderboardArray[0]).length - 2; i++) {
                                                statsName.push(Object.keys(leaderboardArray[0])[i]);
                                            }
                                            for (let i = 1; i < statsName.length; i++) {
                                                leaderboardArray = leaderboardArray.sort((a, b) => {
                                                    if (b[Object.keys(leaderboardArray[0])[i]] > a[Object.keys(leaderboardArray[0])[i]]) {
                                                        return -1;
                                                    }
                                                })
                                                for (let j = 0; j < leaderboardArray.length; j++) {
                                                    note[leaderboardArray[j].player] += j + 1;
                                                }
                                            }

                                            //Rank farm
                                            leaderboardArray = leaderboardArray.sort((a, b) => {
                                                if (b[Object.keys(leaderboardArray[0]).farm] > a[Object.keys(leaderboardArray[0]).farm]) {
                                                    return -1;
                                                }
                                            })
                                            for (let i = 0; i < leaderboardArray.length; i++) {
                                                if (leaderboardArray[i].individualPosition == 'UTILITY') {
                                                    note[leaderboardArray[i].player] += 4;
                                                }
                                                else {
                                                    note[leaderboardArray[i].player] += i + 1;
                                                }
                                                
                                            }

                                            // Check who won
                                            for (let i = 0; i < leaderboardArray.length; i++) {
                                                if (leaderboardArray[i].win) {
                                                    note[leaderboardArray[i].player] += 10;
                                                }
                                                else {
                                                    note[leaderboardArray[i].player] += 0;
                                                }
                                            }
                                            for (let i = 0; i < Object.keys(note).length; i++) {
                                                output += `${Object.keys(note)[i]}: **${note[Object.keys(note)[i]]}**, \n`;
                                            }
                                            msg.reply(`Voici le classement de ta partie : \n${output}`);
                                        }
                                        else if (res.statusCode !== 200) {
                                            msg.reply({content: `L\'erreur ${res.statusCode} est survenue. Veuillez réessayer`, ephemeral : true});
                                        }
                                    })
                                })

                            }
                            else if (res.statusCode !== 200) {
                                msg.reply({content: `L\'erreur ${res.statusCode} est survenue. Veuillez réessayer`, ephemeral : true});
                            }
                        })
                    })
                }
                else if (res.statusCode !== 200) {
                    msg.reply({content: `L\'erreur ${res.statusCode} est survenue. Veuillez réessayer`, ephemeral : true});
                }
            })
        })
    }
}