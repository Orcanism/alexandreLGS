const Discord = require('discord.js');
const https = require('https');
const jsdom = require('jsdom');
const fs = require('fs');

const pick4meList = require('../pick4meList.json');

module.exports = {
    name: 'updatedb',
    description: 'Mets à jour les bases de données d\'Alexandre',

    async run(client, msg, args, author) {
        let championsLink = {host: 'leagueoflegends.fandom.com', path: '/wiki/List_of_champions'};
        https.get(championsLink, res => {
            let html = '';
            res.on('data', chunk => {
                html += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    let htmlDOM = new jsdom.JSDOM(html);
                    let document = htmlDOM.window.document;
                    let championsList = [];
                    for (let i = 0; i < document.getElementsByClassName('article-table')[0].getElementsByClassName('label-only').length; i++) {
                        championsList.push(document.getElementsByClassName('article-table')[0].getElementsByClassName('label-only')[i].getAttribute('data-champion'));
                    }
                    pick4meList.champions = championsList;
                    let pick4meListPush = JSON.stringify(pick4meList, null, 4);
                    fs.writeFile("./pick4meList.json", pick4meListPush, () => console.error);
                }
                else if (res.statusCode !== 200) {
                    msg.reply({content: `L\'erreur ${res.statusCode} est survenue. Veuillez réessayer`, ephemeral : true});
                }
            })
        })
        let runesLink = {host: 'leagueoflegends.fandom.com', path: '/wiki/Rune_(League_of_Legends)'};
        https.get(runesLink, res => {
            let html = '';
            res.on('data', chunk => {
                html += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    let htmlDOM = new jsdom.JSDOM(html);
                    let document = htmlDOM.window.document;
                    let runesList = [];
                    for (let i = 2; i < document.getElementsByClassName('article-table')[0].lastChild.children.length; i+=2) {
                        for (let j = 0; j < document.getElementsByClassName('article-table')[0].lastChild.children[i].children[1].getElementsByClassName('inline-image').length; j++) {
                            runesList.push(document.getElementsByClassName('article-table')[0].lastChild.children[i].children[1].getElementsByClassName('inline-image')[j].getAttribute('data-rune'));
                            console.log(document.getElementsByClassName('article-table')[0].lastChild.children[i].children[1].getElementsByClassName('inline-image')[j].getAttribute('data-rune'));
                        }
                    }
                    pick4meList.runes = runesList;
                    let pick4meListPush = JSON.stringify(pick4meList, null, 4);
                    fs.writeFile("./pick4meList.json", pick4meListPush, () => console.error);
                }
                else if (res.statusCode !== 200) {
                    msg.reply({content: `L\'erreur ${res.statusCode} est survenue. Veuillez réessayer`, ephemeral : true});
                }
            })
        })
        let mythicLink = {host: 'leagueoflegends.fandom.com', path: '/wiki/Mythic_item'};
        https.get(mythicLink, res => {
            let html = '';
            res.on('data', chunk => {
                html += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    let htmlDOM = new jsdom.JSDOM(html);
                    let document = htmlDOM.window.document;
                    let mythicList = [];
                    for (let i = 0; i < document.getElementsByClassName('columntemplate')[0].getElementsByClassName('inline-image').length; i++) {
                        mythicList.push(document.getElementsByClassName('columntemplate')[0].getElementsByClassName('inline-image')[i].getAttribute('data-item'));
                    }
                    pick4meList.items = mythicList;
                    let pick4meListPush = JSON.stringify(pick4meList, null, 4);
                    fs.writeFile("./pick4meList.json", pick4meListPush, () => console.error);
                }
                else if (res.statusCode !== 200) {
                    msg.reply({content: `L\'erreur ${res.statusCode} est survenue. Veuillez réessayer`, ephemeral : true});
                }
            })
        })
        msg.reply('Les bases de données ont bien été mise à jour !');
    }
}