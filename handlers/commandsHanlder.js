const fs = require('fs');

module.exports = async client => {
    fs.readdirSync('./commands').filter(f => f.endsWith('.js')).forEach(async file => {
        let command = require(`../commands/${file}`);
        if (!command.name || typeof command.name !== 'string') throw new TypeError(file);
        client.commands.set(command.name, command);
        console.log(`${file} loaded !`);
    })
}