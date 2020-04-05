const Discord = require('discord.js');
const Cat = require('./cat');

const commands = require('./commands');

const { TOKEN: token, PREFIX: prefix } = require('./bot.config');

const bot = new Discord.Client();

const cat = new Cat(bot);

bot.on('ready', () => {
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log('bot is started');
        console.log(link);
    });
});

bot.on('message', async msg => {
    if (msg.content.startsWith(prefix)) {
        if (cat) {
            await commands(cat, msg);
        }
    }
});


bot.login(token);