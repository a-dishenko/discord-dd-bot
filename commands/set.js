exports.run = (client, msg, args) => {
  if (!msg.personage) {
    msg.channel.send('Не указан игрок');
    return;
  }

  const personage = msg.personage;

  if (msg.member.roles.cache.some(role => role.name === 'bot-master')){
    console.debug('args', args);

    if(args[1] === 'descr'){
      let idx = msg.content.indexOf('descr')+'descr'.length;
      let descrTxt = msg.content.substring(idx);
      //console.debug('rest', descrTxt);
      msg.channel.send('Описаньице!');
      personage.set('descr', descrTxt);
    }else if(args[1] === 'fields'){
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
