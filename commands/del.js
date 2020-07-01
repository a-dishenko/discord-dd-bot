exports.run = (client, msg, args) => {
  if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
    msg.personage.delete(()=>{
      msg.channel.send('Забыли версию 2');
    });
  }else{
    msg.channel.send('Не боярин!');
  }
}
