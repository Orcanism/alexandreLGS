const Discord = require('discord.js');
const memberStats = require('../memberStats.json');

// Fonction getDateElements, donne l'année, le mois ou le jour
function getDateElements(fullDate, elementOfDate) {
	let dateElements = fullDate.split('/');
	if (elementOfDate === "day") {return dateElements[0]}
	else if (elementOfDate === "month") {return dateElements[1]}
	else if (elementOfDate === "year") {return dateElements[2]}
	else {interaction.reply({content: 'Ce n\'est pas une date !', ephemeral: true})}
}

module.exports = {
    name: 'me',
    description: 'Envoie vos statistiques d\'activité sur le serveur',

    async run(client, msg, args, author) {
        let authorMessageCount = memberStats[author.id].messageCount;
        let authorFirstJoinDate = memberStats[author.id].firstJoinDate;

        let dayOfJoin = getDateElements(authorFirstJoinDate, "day");
        let monthOfJoin = getDateElements(authorFirstJoinDate, "month") - 1;
        let yearOfJoin = getDateElements(authorFirstJoinDate, "year");

        let nowTime = new Date();
        let joinTime = new Date(yearOfJoin, monthOfJoin, dayOfJoin);
        let timeBetween = Math.round((nowTime.getTime() - joinTime.getTime()) / 86400000);
        let averageDayMessage = (authorMessageCount / timeBetween).toFixed(2);
        msg.reply('Tu as envoyé **' + authorMessageCount + '** messages et tu as rejoins le serveur pour la première fois le **' + authorFirstJoinDate + '** ce qui fait une moyenne de **' + averageDayMessage + '** message(s) par jour !');
    }
}