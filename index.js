const config = require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();

const PersonageInfo = require('./personage.js')

const prefix = process.env.PREFIX;
const sdir = process.env.SDIR;
const TOKEN = process.env.TOKEN;


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
  console.debug('go');
  if (msg.mentions.users.size != 1) return;
  const taggedUser = msg.mentions.users.first();
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const personage = new PersonageInfo(taggedUser.id);

  if (command === 'set') {
    msg.reply('Боярин ли?');
    if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
      msg.channel.send('Боярин!!');
      console.debug('args', args);

      if(args[1] === 'descr'){
        let idx = msg.content.indexOf('descr')+'descr'.length;
        let descrTxt = msg.content.substring(idx);
        console.debug('rest', descrTxt);
        msg.channel.send('Описаньице!');
        personage.set('descr', descrTxt);
      }else if(args[1] === 'fields'){
        console.debug('fields');
        let idx = msg.content.indexOf('fields')+'fields'.length;
        let fieldsTxt = msg.content.substring(idx);
        let fieldsArr = fieldsTxt.split(';');
        console.debug(fieldsTxt, fieldsArr, fieldsArr.length);
        if (fieldsTxt.trim().length > 0) {
          console.debug('adding');
          fieldsArr.forEach((el) => {
            let f = el.split('|');
            personage.set(f[0],f[1]);
          });
        }else{
          console.debug('clearing');
          //Нужна ли очистка?
        }
      }else{
        msg.channel.send('Неизвестная команда!');
      }

      msg.channel.send(`Запоминаем V2 о: ${taggedUser.username}`);

      personage.save(() => {
          msg.channel.send('Запомнили V2')
      });
    }else{
      msg.channel.send('Не боярин!');
    }
  } else if (command === 'get') {
    msg.channel.send(personage.message());
  } else if (command === 'del') {
    if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
      personage.delete(()=>{
        msg.channel.send('Забыли версию 2');
      });
    }else{
      msg.channel.send('Не боярин!');
    }
  }
});
