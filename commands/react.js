module.exports = {
  name: 'react',
  description: 'Reacts to a message with the provided emojis',
  usage: '<message link> <emojis>',
  cooldown: 5,
  permLevel: 1,
  async run(client, message, args) {
    const emojiRegex = require('emoji-regex')();
    const emoji = message.content.match(emojiRegex).concat(message.content.match(/(?<=<:\w+:)\d+(?=>)/g));
    const info = args[0].split('channels/')[1].split('/');
    (await client.channels.resolve(info[1]).messages.fetch(info[2])).then((msg) => {
      emoji.forEach((emj) => {msg.react(emj)});
      message.channel.send('Done!');
    })

  },
};