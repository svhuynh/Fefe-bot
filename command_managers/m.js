const Discord = require('discord.js');
const ytdl = require('ytdl-core');

module.exports.run = async (client, message, args) => {
    //TODO: Play monkey soundbyte
    if(!message.member.voiceChannel){
        message.channel.sendMessage("Go in a voice channel, dummy.");
        return;
    } else {
        if(!message.guild.voiceConnection){
            message.member.voiceChannel.join().then(function(connection){
                play(client, message);
            });
        }
    }
}

function play(client, message) {

}

module.exports.help = {
    name: "m"
}