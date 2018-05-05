const tokenConfig = require("./token.json");
const botConfig = require("./config.json");
const Discord = require('discord.js');
const fs = require('fs');

const client  = new Discord.Client({disableEveryone: true});

client.commands = new Discord.Collection();

var queue = [];

const soundCommands = ["m", "nook"];

// Plays a local sound file
function localPlay(client, message, fileName) {
    const broadcast = client.createVoiceBroadcast();
    console.log('here');
    broadcast.playFile(`./${fileName}`);
    for (const connection of client.voiceConnections.values()) {
        connection.playBroadcast(broadcast);
    }
}

// File reader for scanning existing command files 
fs.readdir('./command_managers/', (err, files) =>{
    if(err){
        //TODO: Add a logger
        console.log(err);
    }

    let commandFiles = files.filter(f => f.split(".").pop() === "js")
    if(commandFiles.length <= 0){
        console.log("Command files not found");
        return;
    } 

    commandFiles.forEach((f, i) =>{
        let props = require(`./command_managers/${f}`);
        console.log(`${f} loaded`);
        client.commands.set(props.help.name, props);
    })
    


})


client.on('ready', async () => {
    console.log(`${client.user.username} is online!`);
});

// On message reception
client.on('message', async message => {
    let prefix = botConfig.prefix;
    // Ignore bot messages
    if(message.author.bot) return;
    // Ignore private messages
    if(message.channel.type === "dm") return;
    // TODO: Check if message must be filtered

    let messageArray = message.content.split(" ");
    const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Check for soundboard command first
    if(soundCommands.includes(command)) {
        if (!message.member.voiceChannel) {
            message.channel.sendMessage("Go in a voice channel, dummy.");
            return;
        } else {
            if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then(function (connection) {
                    switch (command) {
                        case "nook":
                            localPlay(client, message, "Animal Crossing - Tom Nook's Theme.mp3");
                            break;
                        case "m":
                            localPlay(client, message, "monkey_sound_effect.mp3");
                            break;
                        default:
                            break;
                    }
                    message.delete(10);
                });
            }
        }
    }
    

    // Run matching command file
    let commandFile = client.commands.get(command);
    if(commandFile) {
        console.log("Found.");
        commandFile.run(client, message, args);
    }
    if(command == "stop") {
        queue = [];
    }

});

client.login(tokenConfig.token);