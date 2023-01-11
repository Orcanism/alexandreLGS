const Discord = require('discord.js');
const client = new Discord.Client({intents : 3276799});
const commandHandler = require('./handlers/commandsHanlder');
const slashCommandHandler = require('./handlers/slashCommandsHanlder');
const fs = require('fs');
const cron = require('cron');

const config = require('./config.json');
const private = require('./private.json');
const memberStats = require('./memberStats.json');

client.commands = new Discord.Collection();

client.login(private.token);
commandHandler(client);

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

// Fonction formatDate, renvoie la date du jour au format dd/mm/yyyy
function padTo2Digits(num) {return num.toString().padStart(2, '0')}
function formatDate(date) {
	return [
		padTo2Digits(date.getDate()),
	  	padTo2Digits(date.getMonth() + 1),
	  	date.getFullYear(),
	].join('/');
}

client.on('ready', async () => {
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
    await slashCommandHandler(client);
})

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

client.on('interactionCreate', async interaction => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        let command = require(`./commands/${interaction.commandName}`);
        command.run(client, interaction, interaction.options, interaction.user);
    }
    else if (interaction.isStringSelectMenu()) {
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
})

// Actions s'éxécutant lorsqu'un message est envoyé
client.on('messageCreate', async msg => {
    if (msg.author.bot) return; // Ne prends pas en compte les messages venant de bot

	// Compteur de messages envoyés sur le serveur
	memberStats[msg.author.id].messageCount += 1;
	memberStats[msg.author.id].username = msg.author.username;
	let memberStatsPush = JSON.stringify(memberStats, null, 4);
	fs.writeFile("./memberStats.json", memberStatsPush, () => console.error);
})