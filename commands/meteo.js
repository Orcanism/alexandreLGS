const Discord = require('discord.js');
const https = require('https');
const jsdom = require('jsdom');

module.exports = {
    name: 'meteo',
    description: 'Envoie la météo de Skopje (la capitale de la macédoine)',

    async run(client, msg, args, author) {
        let link = {host: 'weather.com', path: '/fr-FR/temps/aujour/l/13d451840dce871fb7bd25fac368ff94bd3b30b8a2c74fe3285ec75851f54ddc'};
        https.get(link, res => {
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
                    msg.reply(`À Skopje il fait **${temp}** avec un ciel **${sky}**`);
                }
                else if (res.statusCode !== 200) {
                    msg.reply({content: `L\'erreur ${res.statusCode} est survenue. Veuillez réessayer`, ephemeral : true});
                }
            })
        })
    }
}