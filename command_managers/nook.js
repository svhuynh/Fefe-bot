const Discord = require('discord.js');
const ytdl = require('ytdl-core');

function play(connection, message) {
    
}
function localPlay(client, message) {
    const broadcast = client.createVoiceBroadcast();
    console.log('here');
    broadcast.playFile("./Animal Crossing - Tom Nook's Theme.mp3");
    for(const connection of client.voiceConnections.values()){
        connection.playBroadcast(broadcast);
    }
}

module.exports.run = async (client, message, args) => {
    if (!message.member.voiceChannel) {
        message.channel.sendMessage("Go in a voice channel, dummy.");
        return;
    } else {
        if (!message.guild.voiceConnection) {
            message.member.voiceChannel.join().then(function (connection) {
                localPlay(client, message);
            });
        }
    }
}

module.exports.help = {
    name: "nook"
}