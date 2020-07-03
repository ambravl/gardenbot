module.exports = {
  name: 'echo',
  description: 'Repeats whatever the user said',
  usage: '<#channel (optional)> <message>',
  cooldown: 5,
  permLevel: 1,
  args: [1],
  async run(client, message, args) {
    let channel = message.channel;
    let send = {};
    if(args[0].startsWith('<#')) {
      message.content = message.content.slice(args[0].length).trim();
      channel = message.mentions.channels.first();
    }
    if(message.content.startsWith('{')){
      try{
        const obj = JSON.parse(JSON.stringify(message.content));
        send.embed = JSON.parse(obj).embed;
        console.log(send.embed);
        const content = JSON.parse(obj).content;
        if(content) send.content = content;
      } catch(err) {
        console.error(err);
        send.content = message.content;
      }
    } else send.content = message.content;
    if(message.attachments.first()) send.files = message.attachments;
    send.split = true;
      channel.send(send)
        .catch((err) => {client.catch(err)});
  },
};