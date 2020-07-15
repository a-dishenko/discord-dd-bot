const Discord = require('discord.js');
exports.run = (client, msg, args) => {
  const subCommand = args.shift();

  if(!subCommand){
   let helpTmpl = {
     "title":"DnD помогатель",
     "type":"rich",
     "description": 'Бот позволяет сохранять и получать информацию об игровых персонажах в различных игровых сессиях.'+
     ' Для подробной информации о команде используйте dd!help [имя команды]',
     "timestamp":null,
     "color":'BLUE',
     "fields":[],
     "thumbnail":null,
     "image":null,
     "author":null,
     "footer":'Лаборатория Техномага'
   };

   let response = new Discord.MessageEmbed(helpTmpl);

   client.commands.forEach((el, key)=>{
     let comDescr = el.shortDescr || 'нет описания';
     response.addField(key, comDescr);
   });
   msg.reply(response);
  }else{
    msg.reply('Ожидайте!');
  }
};
exports.shortDescr = 'Эта команда';
