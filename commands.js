const { PREFIX: prefix } = require('./bot.config');

module.exports = async (cat, msg) => {

    switch (msg.content) {
        case prefix + 'разбудить':
            await cat.on(msg.channel);
            break;
        case prefix + 'спать':
            await cat.off(msg.channel);
            break;
        case prefix + 'кис кис':
            await cat.invite(msg.channel, msg.author.id);
            break;
        case prefix + 'брысь':
            await cat.away(msg.channel, msg.author.id)
            break;
        case prefix + 'команды':
            msg.channel.send(`***${prefix}разбудить – включает кота\n${prefix}спать – выключает кота\n${prefix}кис кис – зовёт кота к вам в канал\n${prefix}брысь – выгоняет кота из вашего канала***`);
            break;
        default:
            msg.channel.send('***не поинмаю***');
            break;
    }
}