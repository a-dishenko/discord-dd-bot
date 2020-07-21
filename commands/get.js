exports.run = (client, msg, args) => {

  const subCommand = args.shift();
  const GM = client.GameModel;
  const PM = client.PersonageModel;

  if(!msg.PID){
    msg.channel.send('Укажите пользователя');
    return;
  }
  if(subCommand == 'g') {
    const i = args.shift(); //game index
    GM.getByIndex(i, gameObj=>{
      PM.getByGame(msg.PID, gameObj._id, p => {
        //console.debug('personage2', p);
        //console.debug(p.getEmbed(gameObj));
        msg.channel.send(p.getEmbed(gameObj));
        return;
      });
      return;
    });

  }else{
    msg.channel.send('Игра не указана');
    GM.findByUser(msg.PID, PM, (games)=>{
      console.debug('G ', games);
      myGameNames = games.map(g => g.name);
      msg.channel.send('У пользователя есть персонажи в играх: ' + myGameNames.join(', '));
    });
  }
};
exports.shortDescr = 'Выдать информацию по персонажу в одной из игр';
exports.fullDescr = 'dd!get @[пользователь] g [номер игры] \nСписок игр их номеров можно получить командой dd!games';
