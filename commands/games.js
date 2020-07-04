exports.run = async (client, msg, args) => {
  const allGames = await msg.Game.find();
  console.debug('allGames', allGames);
  if(allGames.length === 0){
    msg.channel.send('Список игр пуст');
  }else{
    let txt = 'Доступны игры: ';
    allGames.forEach((game,i) => {
      txt += game.name;
      if(i < (allGames.length-1)) txt += ', ';
    });
    msg.reply(txt);
  }

}
