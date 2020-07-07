exports.run = (client, msg, args) => {
  if (!msg.personage) {
    msg.channel.send('Не указан игрок');
    return;
  }

  const GM = client.GameModel;
  const PM = client.PersonageModel;

  const personage = msg.personage; //deprecated

  if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
    const subCommand = args.shift();
    console.debug('args', args);


    if(subCommand == 'g') {
      const gameIndex = parseInt(args.shift());
      console.debug('gameIndex', gameIndex);
      GM.getByIndex(gameIndex, async gameObj=>{
        if(!gameObj) {  msg.reply('Не могу найти игру'); return }
        msg.reply('Сохраняем персонажа для игры: '+gameObj.name);
        const fieldsStr = args.join(' ');
        const personage2 = await PM.findOne({userId: msg.PID, gameId: gameObj._id });
        if(!personage2){
          msg.reply('У этого пользователя ещё нет персонажа в данной игре. Создаём нового');
          const newPersonage = new PM({
            userId: msg.PID,
            gameId: gameObj._id,
            fields: {}
          });
          console.debug('newPersonage', newPersonage);
          fieldsStr.split(';').forEach((el) => {
            let f = el.split('|');
            newPersonage.fields.set(f[0],f[1]);
          });
          newPersonage.save((err, game)=>{
            if(err) {
              console.error(err);
              msg.channel.send('Что то пошло не так');
            }else{
              msg.channel.send('Готово!');
            }
          });
        } else {
          msg.reply('Персонаж то уже есть! Апдейтим.');
          fieldsStr.split(';').forEach((el) => {
            console.debug('adding');
            let f = el.split('|');
            personage2.fields.set(f[0],f[1]);
          });
        }
      });

      msg.reply('Идёт дикая асинхронщина');
      return;
    }

    if(subCommand === 'descr'){
      let idx = msg.content.indexOf('descr')+'descr'.length;
      let descrTxt = msg.content.substring(idx);
      //console.debug('rest', descrTxt);
      msg.channel.send('Описаньице!');
      personage.set('descr', descrTxt);
    }else if(subCommand === 'fields'){
      console.debug('fields');
      let idx = msg.content.indexOf('fields')+'fields'.length;
      let fieldsTxt = msg.content.substring(idx);
      let fieldsArr = fieldsTxt.split(';');
      console.debug(fieldsTxt, fieldsArr, fieldsArr.length);
      if (fieldsTxt.trim().length > 0) {
        console.debug('adding');
        fieldsArr.forEach((el) => {
          let f = el.split('|');
          personage.set(f[0],f[1]);
        });
      }else{
        console.debug('clearing');
        //Нужна ли очистка?
      }
    }else{
      msg.channel.send('Неизвестная команда!');
    }

    personage.save(() => {
        msg.channel.send('Запомнили V3 - MongoDb')
    });
  }else{
    msg.channel.send('Не боярин!');
  }
}
