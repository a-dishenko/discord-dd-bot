exports.run = async (client, msg, args) => {

  const GM = client.GameModel;

  const allGames = await GM.find();
  console.debug('allGames', allGames);
  if(allGames.length === 0){
    msg.channel.send('Список игр пуст');
  }else{
    let txt = 'Доступны игры: ';
    allGames.forEach((game,i) => {
      let i_ = i++;
      i_ += ': ';
      txt += i_;
      txt += game.name;
      //console.debug('txt', txt);
      if(i < (allGames.length)) txt += ', ';
    });
    msg.reply(txt);
  }
}
