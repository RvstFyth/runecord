const ytdl = require('ytdl-core');

const url = 'https://www.youtube.com/watch?v=wv-7hILtUI4';

let broadCast;
let connections = {};

module.exports = {
    connectedChannels: {},

    async run(msg, args, data) {
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel)
            return msg.channel.send(
                `**${data.user.name}** you need to be in a voice channel to use this command`
            );

        if (connections[msg.member.voice.channel.id])
            return this.stop(msg, args, data);
        else return this.play(msg, args, data);
    },

    async init(msg) {
        if (!broadCast) broadCast = msg.client.voice.createBroadcast();

        broadCast.play(ytdl(url)).on('finish', () => {
            this.init(msg);
        });
    },

    async play(msg, args, data) {
        const permissions = msg.member.voice.channel.permissionsFor(
            msg.client.user
        );
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return msg.channel.send(
                `**${data.user.name}** i am not allowed to play music in this channel..`
            );
        }

        if (!broadCast) {
            await this.init(msg);
        }

        const connection = await msg.member.voice.channel.join();
        if (connection) {
            connections[msg.member.voice.channel.id] = connection;
            connection.play(broadCast);
        } else
            return msg.channel.send(
                `**${data.user.name}** for some reason i can't join your channel. Please contact a developer if this problem persists`
            );
    },

    async stop(msg, args, data) {
        if (connections[msg.member.voice.channel.id]) {
            connections[msg.member.voice.channel.id].dispatcher.end();
            connections[msg.member.voice.channel.id].disconnect();
            delete connections[msg.member.voice.channel.id];
        }
    },
};
