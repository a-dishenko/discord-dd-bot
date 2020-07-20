exports.run = (client, msg, args) => {

  const GM = client.GameModel;

  if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
    const subCommand = args.shift();
    if(subCommand === 'game'){
      const gname = args.join(' ');
      msg.channel.send('Дропаем игру "'+gname+'"');
      //Надо удалить всех привязаных персонажей этой игры
      GM.deleteOne({name: gname},(err)=>{
        if(err){
          console.debug(err)
        }else{
          msg.channel.send('Забыли...');
        }
      });
    }else{
      msg.personage.delete(()=>{
        msg.channel.send('Забыли версию 2');
      });
    }
  }else{
    msg.channel.send('Не боярин!');
  }
};
exports.shortDescr = 'Удалить игру';
exports.fullDescr = 'dd!del game [номер игры] \nВНИМАНИЕ! Удалятся также ВСЕ персонажи созданные для данной игры!';
