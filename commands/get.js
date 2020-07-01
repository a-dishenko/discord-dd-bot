exports.run = (client, msg, args) => {
  msg.channel.send(msg.personage.message());
}
