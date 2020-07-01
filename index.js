const config = require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();

const PersonageInfo = require('./personage.js')

const prefix = process.env.PREFIX;
const sdir = process.env.SDIR;
const TOKEN = process.env.TOKEN;

/*Prepare*/
bot.commands = new Discord.Collection();
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
  if (msg.mentions.users.size != 1) return;
  const taggedUser = msg.mentions.users.first();
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const commandfile = bot.commands.get(command);

  const personage = new PersonageInfo(taggedUser.id);
  msg.personage = personage;

  if(commandfile) commandfile.run(bot, msg, args);
});
