const Discord = require('discord.js');
const fs = require('fs');
const https = require('https');
const jsdom = require('jsdom');
const cron = require('cron');

const config = require('../config.json');

module.exports = {
    name: 'test',
    description: 'Permet de tester les fonctions experimentales du bot',

    async run(client, msg, args, author) {
    }
}