module.exports = {
  name: 'newquiz',
  description: 'Creates a new quiz question for watering verification',
  usage: '<correct reaction> <message, including emojis of all reactions anywhere>',
  cooldown: 5,
  permLevel: 1,
  async run(client, message, args) {
    const emojiRegex = require('emoji-regex')();
    const emoji = message.content.match(emojiRegex);
    emoji.concat(message.content.match(/(?<=<:\w+:)\d+(?=>)/g));
    const rightAnswer = args[0];
    const content = message.content.replace(`${client.cfg.prefix}newquiz ${rightAnswer}`, '').trim();
    client.channels.cache.get(client.cfg.quizChannel).send(content).then((msg) => {
      client.db.hset('quiz', msg.id, rightAnswer);
      emoji.forEach((emj) => {
        console.log(emj);
        if(emj) msg.react(emj);
      });
    })
  },
};