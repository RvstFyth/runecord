// Require 3rd party libraries
const discord = require('discord.js');

// Require custom modules
const db = require('./db');
const config = require('./config');
const commandsHelper = require('./helpers/commands');
const logger = require('./helpers/logger');
const valuesHelper = require('./helpers/values');

// Initialize modules
db.init();
commandsHelper.loadCommands(`${__dirname}/commands/`);
logger.init();

const usersModel = require('./models/users');
const guildSettingsModel = require('./models/guildSettings');
const usersLocksModel = require('./models/usersLocks');
const worldsHelper = require('./helpers/worlds');
const characterHelper = require('./helpers/character');

const client = new discord.Client();

const skillsHelper = require('./helpers/skills');
const skillsModel = require('./models/usersSkills');
setInterval(async () => {
    const users = await usersModel.getAll();
    for (let i in users) {
        const skill = await skillsModel.getFor(users[i].id, 'hitpoints');
        const maxHp = skillsHelper.levelForXp(skill.xp);
        if (users[i].health < maxHp) {
            await usersModel.setHealth(
                users[i].id,
                parseInt(users[i].health) + 1
            );
        }
    }
}, 60 * 2 * 1000);

require('./helpers/areas').init('./areas');

worldsHelper.init();

client.on('ready', async () => {
    logger.info(`Logged in as ${client.user.tag}!`);

    // TopGG bot listing API
    if (config.live && config.topgg_token) {
        const DBL = require('dblapi.js');
        const dbl = new DBL(config.topgg_token, client);
        dbl.on('posted', () => {
            console.log('Server count posted!');
        });
        await dbl.postStats(client.guilds.cache.size);
        setInterval(() => {
            dbl.postStats(client.guilds.cache.size);
        }, 5 * 60 * 1000);
    }
});

client.on('message', async (msg) => {
    if (
        msg.guild &&
        !msg.guild.me.permissionsIn(msg.channel.id).has('SEND_MESSAGES')
    )
        return;
    if (msg.author.bot) return;
    if (msg.mentions.has(client.user))
        return require('./commands/help').run(msg, []);

    let prefix = config.botPrefix;
    // let guildSettings = await guildSettingsModel.getFor(msg.guild.id);
    // if(!guildSettings) {
    //     await guildSettingsModel.create(msg.guild.id, prefix);
    //     guildSettings = await guildSettingsModel.getFor(msg.guild.id);
    // }
    // if(guildSettings) prefix = guildSettings.prefix;

    if (msg.content.toLowerCase().startsWith(prefix)) {
        const command = msg.content
            .toLowerCase()
            .substr(prefix.length)
            .split(' ')
            .filter((c) => c)[0];
        if (commandsHelper.isAllowedCommand(command)) {
            logger.info(
                `${msg.author.username} -- ${msg.content.toLowerCase()}`
            );

            const user = await usersModel.getForDiscordID(msg.author.id);
            if (!user && ['start', 'help'].indexOf(command.toLowerCase()) < 0)
                return msg.channel.send(
                    `**${msg.author.username}** you are not registered yet, use \`${prefix}start\` to create a account`
                );

            if (user) {
                const lockRecord = await usersLocksModel.getFor(user.id);
                if (lockRecord) {
                    const timeLeft = valuesHelper.formattedDifferenceBetweenTimestamp(
                        parseInt(lockRecord.end_timestamp),
                        0,
                        true
                    );
                    return msg.channel.send(
                        `**${user.name}**, ${lockRecord.message}. ${timeLeft} left..`
                    );
                }

                worldsHelper.registerPlayer(
                    user.world,
                    user.name,
                    user.id,
                    user.location,
                    user.area
                );
            }

            const args = commandsHelper.parseArguments(msg, [
                prefix,
                command,
                prefix + command,
            ]);
            const module = commandsHelper.getModuleForCommand(command);

            let char;
            if (user) char = await characterHelper.composeFromUserRecord(user);
            const data = {
                prefix,
                user,
                char,
            };

            if (args[0] && module.sub && module.sub[args[0]]) {
                module.sub[args[0]].run(msg, args.splice(1), data);
            } else module.main.run(msg, args, data);
        }
    }
});

client.on('guildCreate', async (guild) => {
    if (config.support_server_id && config.support_events_channel_id) {
        const channel = client.channels.cache.find(
            (c) => c.id == config.support_events_channel_id
        );
        if (channel) {
            channel.send(`Guild added ${guild.name} - ${guild.id}`);
        }
    }
});

client.on('guildDelete', async (guild) => {
    if (config.support_server_id && config.support_events_channel_id) {
        const channel = client.channels.cache.find(
            (c) => c.id == config.support_events_channel_id
        );
        if (channel) {
            channel.send(`Guild removed ${guild.name} - ${guild.id}`);
        }
    }
});

client.login(config.discordToken);
