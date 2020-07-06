exports.run = (client, msg, args) => {
  if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
    const subCommand = args.shift();
    if(subCommand === 'game'){
      const gname = args.join(' ');
      msg.channel.send('Дропаем игру "'+gname+'"');
      msg.Game.deleteOne({name: gname},(err)=>{
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
}
