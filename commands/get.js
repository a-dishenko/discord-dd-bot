exports.run = (client, msg, args) => {

  const subCommand = args.shift();
  const GM = client.GameModel;
  const PM = client.PersonageModel;

  if(subCommand == 'g') {
    const i = args.shift(); //game index
    GM.getByIndex(i, gameObj=>{
      //msg.channel.send(msg.reply(gameObj.name));
      PM.getByGame(msg.PID, gameObj._id, p => {
        //console.debug('personage2', p);
        //console.debug(p.getEmbed(gameObj));
        msg.channel.send(p.getEmbed(gameObj));
        return;
      });
      return;
    });

  }else{
    console.debug('else ',this);
      msg.channel.send('Неизвестный пользователь или игра');
    //msg.channel.send(msg.personage.message());
  }
};
exports.shortDescr = 'Выдать информацию по персонажу в одной из игр';
exports.fullDescr = 'dd!get @[пользователь] g [номер игры] \nСписок игр их номеров можно получить командой dd!games';
