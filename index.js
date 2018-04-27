const tokenConfig = require("./token.json");
const botConfig = require("./config.json");
const Discord = require('discord.js');

const client  = new Discord.Client();

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
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}hello`){
        return message.channel.send(`Hello ${message.author.username}`);
    }


});

client.login(tokenConfig.token);