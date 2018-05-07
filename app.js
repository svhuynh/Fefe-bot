const tokenConfig = require("./token.json");
const botConfig = require("./config.json");
const Discord = require('discord.js');
const fs = require('fs');
const YTDL = require("ytdl-core");

const client  = new Discord.Client({disableEveryone: true});

client.commands = new Discord.Collection();

var queue = [];
var currentDispatcher = null;

const soundLinks = require("./sounds.json");


// Plays a local sound file
function localPlay(client, message) {
    let youtubeLink = queue.shift();
    console.log(queue);
    const broadcast = client.createVoiceBroadcast();
    for (const connection of client.voiceConnections.values()) {
        // See YTDL doc to see options
        currentDispatcher = connection.playStream(YTDL(youtubeLink, {filter: "audioonly"}));
    }
    // localPlay(client);
    // currentDispatcher.on("end", function(){
    //     // if (queue[0]) {
    //     //     localPlay(client);
    //     // } else {            
    //         for (const connection of client.voiceConnections.values()) {
    //             connection.disconnect();
    //         }
    //     //}
    // })
     if (queue[0]) {
            localPlay(client, message);
    } else {            
        return;
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
    let messageArray = message.content.split(" ");
    
    if(messageArray[0].charAt(0) === prefix){
        // Ignore bot messages
        if(message.author.bot) return;
        // Ignore private messages
        if(message.channel.type === "dm") return;

        // TODO: Check if message must be filtered

        const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        
    
        // Check for soundboard command first
        if (soundLinks.hasOwnProperty(command)) {
            
            queue.push(soundLinks[command]);
            if (!message.member.voiceChannel) {
                message.channel.send(`${message.author.username}, go in a voice channel, you monkey.`);
                message.delete(10);
                return;
            } else {
                if (!message.guild.voiceConnection) {
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