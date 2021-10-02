const { Client, Intents, DiscordAPIError, User, Guild } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MEMBERS] });
const axios = require('axios')
const fs = require('fs');
const CharactersFileName = "Banned_Characters.json";
const prefix = '!'


client.once('ready', () => {
	console.log("Ready!")
});

client.on('messageCreate', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'register'){
        if (message.channel.id === "870975448178372628" ||message.channel.id === "878201048718774284"){
            var ign = args[0]
            message.channel.send("Registering. Give it 5 minutes. If it takes longer than 5 minutes try again.");
            axios.get(`helhttps://gameinfo.albiononline.com/api/gameinfo/search?q=${ign}`)
            .then((res) => {
                const givenname = args[0]
                const playername = Object.values(res.data.players[0])[1]

                if(playername == givenname){
                    if(!message.member.roles.cache.has('877326954779508777')){
                        console.log(checkCharacterList(playername))
                        giveRoleAndName(playername, message);
                    }else{
                        message.channel.send(givenname +" already have this role");
                    }
                }else{
                    message.channel.send( givenname+' does not exist.');
                    message.author.send("Please use your Albion Character name. Dont forget it is capital sensitive.")
                }
            })
            .catch((err) => {
                console.error('ERR:', err)
                message.channel.send("User does not exist");
            });
        }
    }

    if(command === 'kick'){
        if(message.member.roles.cache.has('867128580675469312')){
            const target = message.mentions.members.first();
            if (target){
                message.channel.send("Player has been kicked");
                writeToFile(target);
            }else{
                message.channel.send("No player found."); 
            }
        }
    }

    if(command === 'test'){
        const target = message.mentions.members.first();
        checkCharacterList(target);
    }
});
function giveRoleAndName(playername, message){
    message.member.setNickname(playername);
    message.member.roles.add('877326954779508777');
    message.channel.send('Role added and name changed for '+playername);
}
// append character when registered
function writeToFile(playername) {
    fs.readFile(CharactersFileName, 'utf8', function(err, data){
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data);
            obj.push({Character : playername});
            json = JSON.stringify(obj, null, 2);
            fs.writeFile(CharactersFileName, json, 'utf8',function(err, data){
                if (err) return console.log(err);
            });
        };
    });
}


function checkCharacterList(playername){
    fs.readFile(CharactersFileName, 'utf8', function(err, data){
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data);
            for (var index = 0; index < obj.length; ++index) {
                var character = obj[index];
                for (var key in character) {
                    if (character.hasOwnProperty(key)) {
                        console.log(key.nickname);
                    }
                }
            }
        };
    });
}

client.login(token);

