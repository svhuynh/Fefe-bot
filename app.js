const tokenConfig = require("./token.json");
const botConfig = require("./config.json");
const Discord = require('discord.js');
var filterManager = require('./command_managers/filter');

const client  = new Discord.Client();

var filteredChannels = [];

client.on('ready', async () => {
    console.log(`${client.user.username} is online!`);
});

// On message reception
client.on('message', async message => {
    let prefix = botConfig.prefix;
    // Ignore mot messages
    if(message.author.bot) return;
    // Ignore private messages
    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (cmd) {
        case "hello":
            return message.channel.send(`Hello ${message.author.username}`);
            break;
        case "filter":
            filterManager.run(client, args, filteredChannels);
            break;
    
        default:
            break;
    }


});

client.login(tokenConfig.token);