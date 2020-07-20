const config = require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();

const PersonageInfo = require('./personage.js'); //File Based Object
const {GameShema, PersonageSchema} = require('./schemas.js');

const mongoose = require('mongoose');

const prefix = process.env.PREFIX;
const sdir = process.env.SDIR;
const TOKEN = process.env.TOKEN;
const db_uri = process.env.DB_URI;

mongoose.set('useCreateIndex', true);

mongoose.connect(db_uri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('We have connection! ', db_uri);
  }
);

const Game = mongoose.model('Game', GameShema);
const PersonageModel = mongoose.model('PersonageModel', PersonageSchema);

/*Prepare*/
bot.commands = new Discord.Collection();
bot.db = db;
bot.GameModel = Game;
bot.PersonageModel = PersonageModel;

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
    msg.PID = taggedUser.id;
    msg.personage = new PersonageInfo(taggedUser.id);
    msgStr = msg.content.replace('<@!'+taggedUser.id+'>','');
  }
  const args = msgStr.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const commandfile = bot.commands.get(command);
  //console.debug(taggedUser, args);

  if(commandfile) commandfile.run(bot, msg, args);
});
