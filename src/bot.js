// Require 3rd party libraries
const discord = require('discord.js');

// Require custom modules
const db = require('./db');
const config = require('./config');
const commandsHelper = require('./helpers/commands');
const logger = require('./helpers/logger');

// Initialize modules
db.init();
commandsHelper.loadCommands(__dirname + '/commands/');
logger.init();

const usersModel = require('./models/users');
const guildSettingsModel = require('./models/guildSettings');

const client = new discord.Client();

require('./helpers/areas').init('./areas');

client.on('ready', async () => {
    logger.info(`Logged in as ${client.user.tag}!`);

    // TopGG bot listing API
    if(config.live && config.topgg_token) {
        const DBL = require("dblapi.js");
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

client.on('message', async msg => {
    if(!msg.guild || !msg.guild.me.permissionsIn(msg.channel.id).has('SEND_MESSAGES')) return;
    if(msg.author.bot) return;
    if(msg.mentions.has(client.user)) return require('./commands/help').run(msg, []);

    let prefix = config.botPrefix;
    // let guildSettings = await guildSettingsModel.getFor(msg.guild.id);
    // if(!guildSettings) {
    //     await guildSettingsModel.create(msg.guild.id, prefix);
    //     guildSettings = await guildSettingsModel.getFor(msg.guild.id);
    // }
    // if(guildSettings) prefix = guildSettings.prefix;

    if(msg.content.toLowerCase().startsWith(prefix)) {
        const command = msg.content.toLowerCase().substr(prefix.length).split(' ').filter(c => c)[0];
        if(commandsHelper.isAllowedCommand(command)) {
            logger.info(msg.author.username+' -- ' + msg.content.toLowerCase());

            const user = await usersModel.getForDiscordID(msg.author.id);
            if(!user && ['start', 'help'].indexOf(command.toLowerCase()) < 0) return msg.channel.send(`**${msg.author.username}** you are not registered yet, use \`${prefix}start\` to create a account`);

            const args = commandsHelper.parseArguments(msg, [prefix, command, prefix+command]);
            const module = commandsHelper.getModuleForCommand(command);
            const data = {
                prefix,
                user
            };
            if(args[0] && module.sub[args[0]]) {
                module.sub[args[0]].run(msg, args, data);
            }
            else module.main.run(msg, args, data)
        }
    }
});

client.on('guildCreate', async guild => {
    if(config.support_server_id && config.support_events_channel_id) {
        const channel = client.channels.cache.find(c => c.id == config.support_events_channel_id);
        if(channel) {
            channel.send(`Guild added ${guild.name} - ${guild.id}`);
        }
    }
});

client.on('guildDelete', async guild => {
    if(config.support_server_id && config.support_events_channel_id) {
        const channel = client.channels.cache.find(c => c.id == config.support_events_channel_id);
        if(channel) {
            channel.send(`Guild removed ${guild.name} - ${guild.id}`);
        }
    }
});

client.login(config.discordToken);
