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

PersonageSchema.static('getByGame', function(pid, gid, cb) {
  this.findOne({userId: pid, gameId: gid }).then(r=>{
    console.debug('SUCCESS');
    cb(r);
  },err=>{
    console.debug('FAIL', err);
  });
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
