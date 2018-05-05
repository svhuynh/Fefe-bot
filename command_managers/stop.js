module.exports.run = async (client, message, args) => {
    
    for (const connection of client.voiceConnections.values()) {
        connection.disconnect();
    }
    message.delete(10);
}

module.exports.help = {
    name: "stop"
}