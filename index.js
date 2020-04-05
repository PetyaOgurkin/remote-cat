const Discord = require('discord.js');

const bot = new Discord.Client();

const token = process.env.TOKEN;
const prefix = "<Наташа>";

let start_flag = false;

const rand = (min, max) => +(Math.random() * (max - min) + min).toFixed();

bot.on('ready', () => {
    bot.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log(link);
    });
});

bot.on('message', msg => {
    if (msg.content === prefix + 'кис-кис' && !start_flag) {
        console.log('started');
        bot.setInterval(walk, rand(20000, 20000))
        start_flag = true;
    }

    if (msg.content === prefix + 'кыш-брысь' && start_flag) {
        console.log('stoped');
        bot.destroy();
        bot.login(token);
        start_flag = false;
    }
});

function meow(connection) {
    const dispatcher = connection.play(`./audio/meow${rand(1, 2)}.mp3`, {
        volume: 0.5,
    });
    dispatcher.on('finish', () => {
        setTimeout(() => {
            meow(connection);
        }, rand(40000, 60000));
    });
}

function walk() {
    const channels = [];
    bot.channels.cache.forEach(c => {
        if (c.type === 'voice' && c.members.size > 0) {
            channels.push(c.id)
        }
    })

    bot.channels.fetch(channels[rand(0, channels.length - 1)])
        .then(channel => {
            channel.join().then(connection => {
                meow(connection)
                setTimeout(() => {
                    channel.leave()
                }, 180000);
            }).catch(e => {
                console.error(e);
            });
        })
        .catch(console.error);
}

bot.login(token);