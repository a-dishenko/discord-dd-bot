exports.run = (client, msg, args) => {

  if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
    console.debug('args', args);
    const gameName = args.join(' ');
    msg.channel.send('Добавляем игру '+gameName);
    const g = new msg.Game({name: gameName, description: 'TEST TEST TEST'});
    g.save((err, game)=>{
      if(err) {
        console.error(err);
        if(err.code == 11000){
          msg.channel.send('Звиняйте, такая игра уже есть!');
        }
      }else{
        msg.channel.send('Готово!');
      }
      console.debug('game saved', game);
    });
  }else{
    msg.channel.send('Не боярин!');
  }
}
