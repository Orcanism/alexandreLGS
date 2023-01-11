const Discord = require('discord.js');
const memberStats = require('../memberStats.json');

module.exports = {
    name: 'leaderboard',
    description: 'Envoie le classement des knacks les plus actives du serveur',

    async run(client, msg, args, author) {
        let leaderboardArray = [];
        for (let i = 0; i < Object.keys(memberStats).length; i++) {
            let arrayKey = Object.keys(memberStats)[i];
            leaderboardArray.push(memberStats[arrayKey]);
        }
        leaderboardArray = leaderboardArray.sort((a, b) => {
            if (b.messageCount < a.messageCount) {
                return -1;
            }
        }).slice(0, 4);
        let firstPlace = ':first_place: **- ' + leaderboardArray[0].username + '** avec **' + leaderboardArray[0].messageCount + '** messages !';
        let secondPlace = ':second_place: **- ' + leaderboardArray[1].username + '** avec **' + leaderboardArray[1].messageCount + '** messages !';
        let thirdPlace = ':third_place: **- ' + leaderboardArray[2].username + '** avec **' + leaderboardArray[2].messageCount + '** messages !';
        let fourthPlace = ':chocolate_bar: **- ' + leaderboardArray[3].username + '** avec **' + leaderboardArray[3].messageCount + '** messages !';
        msg.reply('Voici les knacks les plus actives du serveur !\n\n' + firstPlace + '\n' + secondPlace + '\n' + thirdPlace + '\n' + fourthPlace);
    }
}