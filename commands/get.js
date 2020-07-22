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
        msg.channel.send(p.getEmbed(gameObj));
        return;
      });
      return;
    });
  }else{
    msg.channel.send('Игра не указана');
    GM.findByUser(msg.PID, PM, (games)=>{
      myGameNames = games.map(g => g.name);
      let rtext = 'У пользователя ';
      if(myGameNames.length > 0){
        rtext += ('есть персонажи в играх: ' + myGameNames.join(', '));
      }else{
        rtext += 'нет игровых персонажей ни в одной игре';
      }
      msg.channel.send(rtext);
    });
  }
};

exports.shortDescr = 'Выдать информацию по персонажу в одной из игр';
exports.fullDescr = 'dd!get @[пользователь] g [номер игры] \nСписок игр их номеров можно получить командой dd!games';
