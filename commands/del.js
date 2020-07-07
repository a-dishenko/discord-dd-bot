exports.run = (client, msg, args) => {

  const GM = client.GameModel;


  if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
    const subCommand = args.shift();
    if(subCommand === 'game'){
      const gname = args.join(' ');
      msg.channel.send('Дропаем игру "'+gname+'"');
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
}
