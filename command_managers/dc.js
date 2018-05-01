module.exports.run = async (client, message, args) => {
    

message.member.voiceChannel.disconnect();
    for (const connection of client.voiceConnections.values()) {
        connection.playBroadcast(broadcast);
    }
}

module.exports.help = {
    name: "dc"
}