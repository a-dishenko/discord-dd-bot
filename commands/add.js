exports.run = (client, msg, args) => {

  if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
    console.debug('args', args);
    const gameName = args.shift();
    msg.channel.send('Добавляем игру '+gameName);
    const g = new msg.Game({name: gameName, description: 'TEST TEST TEST'});
    g.save((err, game)=>{
      if(err) console.error(err);
      console.debug('game saved', game);
    });
  }else{
    msg.channel.send('Не боярин!');
  }
}
