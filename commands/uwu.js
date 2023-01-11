const Discord = require('discord.js');
const https = require('https');
const jsdom = require('jsdom');

module.exports = {
    name: 'uwu',
    description: 'Envoie la photo d\'un chat trop meugnon UwU',

    async run(client, msg, args, author) {
        let link = {host: 'api.thecatapi.com', path: '/v1/images/search'};
        https.get(link, res => {
            let html = '';
            res.on('data', chunk => {
                html += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    let htmlDOM = new jsdom.JSDOM(html);
                    let document = htmlDOM.window.document;
                    msg.reply(JSON.parse(document.childNodes[0].childNodes[1].childNodes[0].textContent)[0].url);
                }
                else if (res.statusCode !== 200) {
                    msg.reply({content: `L\'erreur ${res.statusCode} est survenue. Veuillez réessayer`, ephemeral : true});
                }
            })
        })
    }
}