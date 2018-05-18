const Discord = require('discord.js');
const fs = require('fs');
const ytdl = require("ytdl-core");
const soundLinks = require("../sounds.json");


module.exports.run = async (bot, message, args) => {
    var jsonFileSize = Object.keys(soundLinks).length;

    const embed = new Discord.RichEmbed()
    .setTitle("Here are all the available sound commands")
    .setAuthor(bot.user.username)
    .setThumbnail(bot.user.avatarURL)
    .setColor(0XD40E0F);
    var videoPromises = [];
    var fieldValues = [];
    var unassociatedPromises = [];
    for(command in soundLinks) {
        let promise = ytdl.getInfo(soundLinks[command]);
        // let promise = ytdl.getInfo(soundLinks[command]).then( info => {
        //     fieldValues[command] = info.title;
        // });

        videoPromises[command] = promise;
        unassociatedPromises.push(promise);
    }
    Promise.all(videoPromises).then(function () {
        // TODO: Change to proper promise management
        var promiseResolvedCounter = 0;
        for (const [key, value] of Object.entries(videoPromises)) {
            let videoTitle = "";
            value.then(info => {
                videoTitle = info.title;
                console.log(info.title);
                embed.addField(key, `[${videoTitle}](${soundLinks[key]})`);
                promiseResolvedCounter++;
                if (promiseResolvedCounter === jsonFileSize) {
                    message.channel.send(embed);
                    console.log("check");
                }
            });
        }
        // for (const [command, videoTitle] of Object.entries(fieldValues)) {
            
        //     embed.addField(key, videoTitle);
        // }
        // console.log(fieldValues);

        
    }, function (err) {

    });
}

module.exports.help = {
    name: "allsounds"
}