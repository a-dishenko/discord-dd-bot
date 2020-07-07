exports.run = (client, msg, args) => {

  const subCommand = args.shift();
  const GM = client.GameModel;
  const PM = client.PersonageModel;
  console.debug('args', args);

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
    console.debug('else');
    msg.channel.send(msg.personage.message());
  }
}
