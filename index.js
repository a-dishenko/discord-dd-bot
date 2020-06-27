const config = require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();


const prefix = process.env.PREFIX;
const TOKEN = process.env.TOKEN;

const getBoyarInfo = function(){
  var bi = new Discord.MessageEmbed();
  bi.setColor('#0099ff')
  .setTitle('Боярская инфа')
  .setDescription('Боярин сей многими свойствами обладает')
  .addFields(
		{ name: 'Характер', value: 'Нордический' },
    { name: 'Уменья', value: 'Космические'})
  .setTimestamp()
  .setFooter('Многие лета!');
  return bi;
};

function getFileName(id){
  return './savedInfo/usr' + id + '.json';
}

function saveInfo(fname, dat, msg){
  fs.writeFile(fname, dat , function (err,data) {
    if(err){
        msg.channel.send('File writing error');
    }else{
        msg.channel.send('Success!');
    }
  });
}

function loadInfo(fname, msg, cb){
  var boyarInfo = new Discord.MessageEmbed(),
      is_new = true;
  if(fs.existsSync(fname)){
    msg.channel.send(`О нём нам ведомо!`);
    let data = JSON.parse(fs.readFileSync(fname));
    console.debug('data', data);
    boyarInfo = new Discord.MessageEmbed(data);
    is_new = false;
    console.debug('boyarInfo', boyarInfo);
  }else{
    msg.channel.send(`О нём не знаем!`);
  }
  return { data: boyarInfo, is_new: is_new }
}

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  console.debug('go');
  if (msg.mentions.users.size != 1) return;
  const taggedUser = msg.mentions.users.first();
  const fn = getFileName(taggedUser.id);
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'set') {
    msg.reply('Боярин ли?');
    if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
      msg.channel.send('Боярин!!');
      console.debug('args', args);
      let info = loadInfo(fn, msg).data;
      info.setTimestamp();
      if(args[1] === 'descr'){
        let idx = msg.content.indexOf('descr')+'descr'.length;
        let descrTxt = msg.content.substring(idx);
        console.debug('rest', descrTxt);
        msg.channel.send('Описаньице!');
        info.setDescription(descrTxt);
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
            info.addField(f[0],f[1]);
          });
        }else{
          console.debug('clearing');
          info.spliceFields(0, info.fields.length);
        }
      }else{
        msg.channel.send('Незнаемо!');
      }

      msg.channel.send(`Запоминаем о: ${taggedUser.username}`);
      /*
      const tmp = new Discord.MessageEmbed(data.data).setColor('#0099ff')
      .setTitle('Боярская инфа')
      .setDescription('Боярин сей многими свойствами обладает')
      .addFields({name: 'Характер', value: 'Стоический'},{name: 'Возраст', value: 'Преклонный'}); */
      const dt = JSON.stringify(info);
      saveInfo(fn, dt, msg);
    }else{
      msg.channel.send('Не боярин!');
    }
  } else if (command === 'get') {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`Вопрошаешь о: ${taggedUser.username}`);
      try{
        let data = loadInfo(fn, msg);
        if(!data.is_new){
          msg.channel.send(data.data)
        }
      } catch(err) {
        console.error(err);
      }

    } else {
      msg.reply('Не знаю о ком сие!');
    }
  } else if (command === 'del') {
    if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
      fs.unlink(getFileName(taggedUser.id), (err) => {
        if (err) {
          console.error(err)
        }
        msg.reply('Забыли');
      });
    }else{
      msg.channel.send('Не боярин!');
    }

  } else if (msg.content.startsWith('!kick')) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    } else {
      msg.reply('Please tag a valid user!');
    }
  }
});
