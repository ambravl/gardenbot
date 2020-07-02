module.exports = {
  name: 'echo',
  description: 'Repeats whatever the user said',
  usage: '<#channel (optional)> <message>',
  cooldown: 5,
  permLevel: 1,
  async run(client, message, args) {
    if(args[0].startsWith('<#')){
      message.mentions.channels.first().send(message.content.slice(client.cfg.prefix.length + 6 + args[0].length))
        .catch((err) => {client.catch(err)});
    }
    else{
      message.channel.send(message.content.slice(client.cfg.prefix.length + 5))
        .catch((err) => {client.catch(err)});
    }
  },
};