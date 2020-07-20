const Discord = require('discord.js');
exports.run = (client, msg, args) => {
  const subCommand = args.shift();

  if(!subCommand){
   let helpTmpl = {
     "title":"DnD помогатель",
     "type":"rich",
     "description": 'Бот позволяет сохранять и получать информацию об игровых персонажах в различных игровых сессиях.'+
     '\n Для подробной информации о команде используйте dd!help [имя команды]',
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
    if(!client.commands.has(subCommand)){
      msg.channel.send('Неизвестная команда: '+subCommand);
      return;
    }
    const cmd = client.commands.get(subCommand);
    let fullHelp = cmd.fullDescr;
    if(fullHelp){
      fullHelp = 'Подробное описание команды '+subCommand+'\n' + fullHelp;
    }else{
       fullHelp = 'Нет подробного описания';
    }
    msg.channel.send(fullHelp);
  }
};
exports.shortDescr = 'Эта команда';
