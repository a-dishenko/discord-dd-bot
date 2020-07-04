const fs = require('fs');
const Discord = require('discord.js');
/*const MongoClient = require('mongodb').MongoClient; */

/*
const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow')); */
var dbHandler;
/*
MongoClient.connect(uri, function(err, client) {
  // Use the admin database for the operation
  console.debug('err', err);
  var adminDb = client.db().admin();
  var db = client.db('mainDB');
  dbHandler = db;
  var games = db.collection('games');
  var personages = db.collection('personages');
});
*/

const sdir = process.env.SDIR;

const infoTemplate = {
  "title":"Сведения о персонаже",
  "type":"rich",
  "description":null,
  "timestamp":null,
  "color":'RED',
  "fields":[],
  "thumbnail":null,
  "image":null,
  "author":null,
  "footer":null
};

class PersonageInfo {
  constructor(userId){
    //console.debug('Creating new userinfo instance for '+userId);
    this.props = []; //Allowed properties?
    this.fn = sdir+'/usrV2_' + userId  + '.json';
    if(fs.existsSync(this.fn)){
      console.debug('V2 file exists');
      this.obj = JSON.parse(fs.readFileSync(this.fn));
    }else{
      console.debug('V2 file not exists');
      this.obj = null;
    }
    //console.debug('V2 obj ',this.obj);
  }
  /* Translate object into embed*/
  message(){
    if(this.obj){
      let msg = new Discord.MessageEmbed(infoTemplate);
      msg.setDescription('V2 - в процессе');
      msg.setAuthor("Валенсия");
      if(this.obj.descr) msg.setDescription(this.obj.descr);
      Object.keys(this.obj.fields).forEach((key)=>{
        msg.addField(key, this.obj.fields[key]);
      });

      msg.setFooter('© Лаборатория Техномага');
      return msg;
    }else{
      return 'Нет информации';
    }
  }
  set(name, value){
    console.debug('setting' ,name );
    if(!this.obj) this.obj = {};
    if(name == 'descr')  {
      this.obj.descr = value;
      return
     } //Temporary solution, description will be defined by game
    if(!this.obj.fields) this.obj.fields = {};
    this.obj.fields[name] = value;
  }
  save(cb){
    console.debug('obj ', this.obj);
    let dat = JSON.stringify(this.obj);
    fs.writeFile(this.fn, dat , function (err,data) {
      if(err){
        console.debug('V2 file error`');
      }else{
        console.debug('V2 file save success!');
      }
    });
    console.debug('obj!!', this.obj);
    //this.db.collection('personages').insert(this.obj, cb);
  }
  delete(cb){
    fs.unlink(this.fn, (err) => {
      if (err) {
        console.error(err)
      }
      cb();
    });
  }
}

module.exports = PersonageInfo;
