const { INSIDEINTERVAL: insideInterval, OUTSIDEINTERVAL: outsideInterval, MEOWINTERVAL: meowInterval } = require('./bot.config');

module.exports = class Cat {
    constructor(bot) {
        this.bot = bot;
        this.enabled = false;
        this.walkTimer;
        this.meowTimer;
        this.insideInterval = insideInterval;
        this.outsideInterval = outsideInterval;
        this.meowInterval = meowInterval;
    }

    async on(textChannel) {
        if (!this.enabled) {
            this.enabled = true;
            textChannel.send('***просыпается***');
            await this.invite(textChannel);
        } else {
            textChannel.send('***ш-ш-ш-ш***');
        }
    }

    async off(textChannel) {
        if (this.enabled) {
            if (this._checkChannel(this.bot.user.id)) {
                await this.away(textChannel);
            }

            clearTimeout(this.walkTimer);
            this.enabled = false;
            textChannel.send('***засыпает***');
        } else {
            textChannel.send('***спит***');
        }
    }

    async invite(textChannel, user) {
        if (this.enabled) {
            const botChannel = this._checkChannel(this.bot.user.id);

            if (!botChannel) {
                if (user) {
                    const userChannel = this._checkChannel(user);
                    if (userChannel) {
                        try {
                            const channel = await this.bot.channels.fetch(userChannel);
                            const connection = await channel.join();
                            this.meow(connection);

                        } catch (error) {
                            console.error(error);
                        }

                        clearTimeout(this.walkTimer);
                        this.walkTimer = setTimeout(this.away.bind(this, textChannel), this.insideInterval);
                    } else {
                        textChannel.send('***в недоумении***');
                    }
                } else {
                    const channels = [];
                    this.bot.channels.cache.forEach(c => {
                        if (c.type === 'voice' && c.members.size > 0) {
                            channels.push(c.id)
                        }
                    })

                    if (channels.length) {
                        try {
                            const channel = await this.bot.channels.fetch(channels[this._rand(0, channels.length - 1)]);
                            const connection = await channel.join();
                            this.meow(connection);

                        } catch (error) {
                            console.error(error);
                        }

                        clearTimeout(this.walkTimer);
                        this.walkTimer = setTimeout(this.away.bind(this, textChannel), this.insideInterval)
                    } else {
                        await this.off(textChannel);
                    }
                }
            } else {
                if (user) {
                    const userChannel = this._checkChannel(user);
                    if (userChannel) {
                        try {
                            const channel = await this.bot.channels.fetch(userChannel);
                            const connection = await channel.join();
                            this.meow(connection);

                        } catch (error) {
                            console.error(error);
                        }

                        clearTimeout(this.walkTimer);
                        this.walkTimer = setTimeout(this.away.bind(this, textChannel), this.insideInterval)

                    } else {
                        textChannel.send('***в недоумении***');
                    }
                }
            }
        } else {
            textChannel.send('***чтобы позвать кота, нужно разбудить кота***');
        }
    }

    async away(textChannel, user) {

        if (this.enabled) {
            const botChannel = this._checkChannel(this.bot.user.id);

            if (botChannel) {
                if (user) {
                    const userChannel = this._checkChannel(user);
                    if (userChannel === botChannel) {
                        try {
                            const channel = await this.bot.channels.fetch(botChannel);
                            await channel.leave();
                        } catch (error) {
                            console.error(error);
                        }

                        clearTimeout(this.walkTimer);
                        this.walkTimer = setTimeout(this.invite.bind(this), this.outsideInterval)
                    } else {
                        textChannel.send('***меня здесь нет***');
                    }
                } else {
                    try {
                        const channel = await this.bot.channels.fetch(botChannel);
                        await channel.leave();
                    } catch (error) {
                        console.error(error);
                    }

                    clearTimeout(this.walkTimer);
                    this.walkTimer = setTimeout(this.invite.bind(this, textChannel), this.outsideInterval)
                }
            } else {
                textChannel.send('***кот в мире духов***');
            }
        } else {
            textChannel.send('***кот спит, не надо его гнать***');
        }
    }

    meow(connection) {
        clearTimeout(this.meowTimer);
        const dispatcher = connection.play(`./audio/meow${this._rand(1, 2)}.mp3`, {
            volume: 0.5,
        });

        dispatcher.on('finish', () => {
            this.meowTimer = setTimeout(this.meow.bind(this, connection), this.meowInterval)
        });
    }

    _checkChannel(id) {
        let check = false;
        this.bot.channels.cache.forEach(c => {
            if (c.type === 'voice' && c.members.size > 0) {
                c.members.forEach(m => {
                    if (m.id === id) {
                        check = c.id;
                    }
                })
            }
        })

        return check;
    }

    _rand(min, max) {
        return +(Math.random() * (max - min) + min).toFixed();
    }
}