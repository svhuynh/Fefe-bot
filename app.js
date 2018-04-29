const tokenConfig = require("./token.json");
const botConfig = require("./config.json");
const Discord = require('discord.js');
const fs = require('fs');

const client  = new Discord.Client({disableEveryone: true});

client.commands = new Discord.Collection();

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
    //TODO: Check if message must be filtered

    let messageArray = message.content.split(" ");
    const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let commandFile = client.commands.get(command);
    if(commandFile) {
        console.log("FOund");
        commandFile.run(client, message, args);
    }

});

client.login(tokenConfig.token);