const Discord = require('discord.js');
const https = require('https');
const jsdom = require('jsdom');
const private = require('../private.json')

module.exports = {
    name: 'meteo',
    description: 'Envoie la météo de Skopje (la capitale de la macédoine)',

    async run(client, msg, args, author) {
        let linkPath = '/data/2.5/weather?lat=42&lon=21.43&units=metric&lang=fr&appid=' + private.apiKeyOpenWeather;
        let link = {host: 'api.openweathermap.org', path: linkPath};
        https.get(link, res => {
            let html = '';
            res.on('data', chunk => {
                html += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    let htmlDOM = new jsdom.JSDOM(html);
                    let document = htmlDOM.window.document;
                    let info = JSON.parse(document.children[0].textContent);
                    let temp = Math.round(info.main.temp);
                    let sky = Math.round(info.clouds.all);
                    msg.reply(`À Skopje il fait **${temp}°** avec une couverture nuageuse de **${sky}%**`);
                }
                else if (res.statusCode !== 200) {
                    msg.reply({content: `L\'erreur ${res.statusCode} est survenue. Veuillez réessayer`, ephemeral : true});
                }
            })
        })
    }
}