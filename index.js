const config = require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();

const PersonageInfo = require('./personage.js'); //File Based Object

const mongoose = require('mongoose');
const uri = "mongodb+srv://discord-dd-bot:wCJ3%24f%23-qRTPXL.@cluster0.bv3jq.mongodb.net/test?retryWrites=true&w=majority&useUnifiedTopology=true";

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.debug('We have connection!');
});

const Game = mongoose.model('Game', { name: String, description: String });


const prefix = process.env.PREFIX;
const sdir = process.env.SDIR;
const TOKEN = process.env.TOKEN;

/*Prepare*/
bot.commands = new Discord.Collection();
bot.db = db;
fs.readdir("./commands/", (err, files) => {
  if (err) return console.log(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    console.log("Successfully loaded " + file)
    let commandName = file.split(".")[0];
    bot.commands.set(commandName, props);
  });
});

/*START*/
bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);




  if(fs.existsSync(sdir)){
    console.info('Service directory exists '+sdir);
  }else{
    console.info('Creating service directory '+sdir);
    fs.mkdirSync(sdir);
    console.info('Done!');
  }
});

bot.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  //if (msg.mentions.users.size != 1) return;
  let msgStr = msg.content;
  const taggedUser = msg.mentions.users.first();
  if(taggedUser){
    msg.personage = new PersonageInfo(taggedUser.id);
    msgStr = msg.content.replace('<@!'+taggedUser.id+'>','');
  }
  msg.Game = Game;
  const args = msgStr.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const commandfile = bot.commands.get(command);
  console.debug(taggedUser, args);



  if(commandfile) commandfile.run(bot, msg, args);
});
