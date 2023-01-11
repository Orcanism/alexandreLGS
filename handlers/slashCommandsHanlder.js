const Discord = require('discord.js');

module.exports = async client => {
    let commands = [];
    client.commands.forEach(async command => {
        let slashCommand = new Discord.SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .setDMPermission(false)
        .setDefaultMemberPermissions(null)

        if (command.options?.length >= 1) {
            for (let i = 0; i < command.options.length; i++) {
                slashCommand[`add${command.options[i].type.slice(0, 1).toUpperCase() + command.options[i].type.slice(1, command.options[i].type.length)}Option`]
                (option => option.setName(command.options[i].name).setDescription(command.options[i].description).setRequired(command.options[i].required));
            }
        }
        await commands.push(slashCommand)
    });
    const rest = new Discord.REST({version: '10'}).setToken(client.token);
    await rest.put(Discord.Routes.applicationCommands(client.user.id), {body: commands});
    console.log('Slash commands loaded !');
}