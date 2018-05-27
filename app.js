const tokenConfig = require("./token.json");
const botConfig = require("./config.json");
const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require("ytdl-core");
const soundLinks = require("./sounds.json");


const client  = new Discord.Client({disableEveryone: true});

client.commands = new Discord.Collection();

var queue = [];
var currentVoiceChannel = null;




// Plays a local sound file
function localPlay(client, message) {
    let youtubeLink = queue.shift();
    console.log(queue);
    client.createVoiceBroadcast();
    for (const connection of client.voiceConnections.values()) {
        // See YTDL doc to see options
        connection.playStream(ytdl(youtubeLink, {filter: "audioonly"}));
    }
    if (queue[0]) {
        localPlay(client, message);
    } else {            
        return;
    }
}

function disconnectVoiceChannel(voiceChannel) {
    if(voiceChannel === null) {
        return null;
    } else {
        if(voiceChannel.members.size === 0) {
            for (const connection of client.voiceConnections.values()) {
                connection.disconnect();
            }
            
        }
    }
}

function startTimer() {
    return setInterval(() => {
        disconnectVoiceChannel(currentVoiceChannel);
    }, 60000);
}

// File reader for scanning existing command files 
fs.readdir("./command_managers/", (err, files) =>{
    if(err) {
        //TODO: Add a logger
        console.log(err);
    }

    let commandFiles = files.filter(f => f.split(".").pop() === "js")
    if(commandFiles.length <= 0) {
        console.log("Command files not found");
        return;
    } 

    commandFiles.forEach((f, i) =>{
        let props = require(`./command_managers/${f}`);
        console.log(`${f} loaded`);
        client.commands.set(props.help.name, props);
    });
    


});


client.on("ready", async () => {
    console.log(`${client.user.username} is online!`);
    startTimer();
});

// On message reception
client.on("message", async message => {

    let prefix = botConfig.prefix;
    let messageArray = message.content.split(" ");
    
    if(messageArray[0].charAt(0) === prefix){
        // Ignore bot messages
        if(message.author.bot) return;
        // Ignore private messages
        if(message.channel.type === "dm") return;

        // TODO: Check if message must be filtered

        const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        console.log("command received: " + command);
        
    
        // Check for soundboard command first
        if (soundLinks.hasOwnProperty(command)) {
            
            queue.push(soundLinks[command]);
            if (!message.member.voiceChannel) {
                message.channel.send(`${message.author.username}, go in a voice channel, you monkey.`);
                message.delete(10);
                return;
            } else {
                if (!message.guild.voiceConnection) {
                    currentVoiceChannel = message.guild.voiceConnection;
                    message.member.voiceChannel.join().then(function (connection) {
                        localPlay(client);
                        
                        
                    });
                } else {
                    if(queue.length !== 0)
                        localPlay(client);
                    else
                        return;
                }
                
            }
        }

        // Run matching command file
        let commandFile = client.commands.get(command);
        if(commandFile) {
            commandFile.run(client, message, args);
        }
        if(command == "stop") {
            queue = [];
        }
        message.delete(10);    
    }
});

client.login(tokenConfig.token);