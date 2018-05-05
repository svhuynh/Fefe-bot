module.exports.run = async (client, message, args) => {
    for (const connection of client.voiceConnections.values()) {
        connection.disconnect();
    }
}

module.exports.help = {
    name: "stop"
}