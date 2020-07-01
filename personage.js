const fs = require('fs');
const Discord = require('discord.js');

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
    console.debug('Creating new userinfo instance for '+userId);
    this.props = []; //Allowed properties?
    this.fn = sdir+'/usrV2_' + userId  + '.json';
    if(fs.existsSync(this.fn)){
      console.debug('V2 file exists');
      this.obj = JSON.parse(fs.readFileSync(this.fn));
    }else{
      console.debug('V2 file not exists');
      this.obj = null;
    }
    console.debug('V2 obj ',this.obj);
  }
  /* Translate object into embed*/
  message(){
    if(this.obj){
      let msg = new Discord.MessageEmbed(infoTemplate);
      msg.setDescription('V2 - в процессе');
      msg.setAuthor("Валенсия");
      if(this.obj.descr) msg.setDescription(this.obj.descr);

      this.obj.fields.forEach((el)=>{
        msg.addField(el.name, el.value);
      });

      msg.setFooter('© Лаборатория Техномага');
      return msg;
    }else{
      return 'Нет информации';
    }
  }
  set(name, value){
    if(!this.obj) this.obj = {};
    if(name == 'descr')  {
      this.obj.descr = value;
      return
     } //Temporary solution, description will be defined by game
    if(!this.obj.fields) this.obj.fields = [];
    this.obj.fields.push({name: name, value: value});
  }
  save(cb){
    let dat = JSON.stringify(this.obj);
    fs.writeFile(this.fn, dat , function (err,data) {
      if(err){
        console.debug('V2 file error`');
      }else{
        console.debug('V2 file save success!');
        cb();
      }
    });
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
