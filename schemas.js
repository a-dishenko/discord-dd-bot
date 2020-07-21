const Discord = require('discord.js');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const infoTemplate = {
  "title":"Сведения о персонаже",
  "type":"rich",
  "description":null,
  "timestamp":null,
  "color":'CYAN',
  "fields":[],
  "thumbnail":null,
  "image":null,
  "author":null,
  "footer":null
};

const GameShema = new Schema({
  name: {
    type: String,
    unique: true
  },
  description: String
});

const PersonageSchema = new Schema({
  userId: {
    type: String, /*Discord ID*/
    required: true
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: true
  },
  fields: {
    type: Map,
    of: String
  }
});

//Получить список игр пользователя
GameShema.static('findByUser', async function(uid, PS, cb){
  const userPersonages = await PS.find({userId: uid});
  let myGames = [];
  await userPersonages.forEach(async el=>{
    //console.debug('     el',el);
    let game = await this.findById(el.gameId);
    myGames.push(game);
  });
  console.debug('myGames -----', myGames);
  cb(myGames);
});

// Получить игру по номеру
GameShema.static('getByIndex', function(i, cb) {
  i = parseInt(i);
  return this.find().then((r)=>{
    if(r.length < (i+1)) {
      console.log('Неизвестная игра');
      cb();
    }else{
      const game = r[i];
      console.log('Нашли игру: '+game.name);
      cb(r[i]);
    }
  },()=>{
    cb();
  });
});


PersonageSchema.static('getByGame', function(pid, gid, cb) {
  this.findOne({userId: pid, gameId: gid }).then(r=>{
    console.debug('SUCCESS');
    cb(r);
  },err=>{
    console.debug('FAIL', err);
  });
});

PersonageSchema.static('findMyGames', async function(uid, cb){
  const allGames = await this.find();
  const userPersonages = await PersonageSchema.find({userId: uid});
  console.debug(allGames);
  console.debug('UP', userPersonages);
  cb();
});

PersonageSchema.method('getEmbed', function(gameObj) {
  let msg = new Discord.MessageEmbed(infoTemplate);
  msg.setDescription('Тут должно быть некое общее описание - но не понятно, игры или персонажа?');
  msg.setAuthor(gameObj.name);
  //if(this.obj.descr) msg.setDescription(this.obj.descr);
  console.debug('this', this);
  this.fields.forEach((val,key)=>{
    msg.addField(key, val);
  });

  msg.setFooter('© Лаборатория Техномага');
  return msg;
});

module.exports.GameShema = GameShema;
module.exports.PersonageSchema = PersonageSchema;
