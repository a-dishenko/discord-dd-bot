exports.run = (client, msg, args) => {
  const GM = client.GameModel;

  if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
    const gameName = args.join(' ');
    msg.channel.send('Добавляем игру '+gameName);
    const g = new GM({name: gameName, description: 'TEST TEST TEST'});
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
};
exports.shortDescr = 'Добавить новую игру';
