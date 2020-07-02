module.exports = {
  name: 'newquiz',
  description: 'Creates a new quiz question for watering verification',
  cooldown: 5,
  permLevel: 1,
  async run(client, message, args) {
      const emoji = message.content.match(/[^\x00-\x7F\uFE00-\uFE0F]|(?<=<:\w+:)\d+(?=>)/gu);
    const rightAnswer = args[0];
    const content = message.content.replace(`${client.cfg.prefix}newquiz ${rightAnswer}`, '').trim();
    client.channels.cache.get(client.cfg.quizChannel).send(content).then((msg) => {
      client.db.set(`quiz:${msg.id}`, rightAnswer);
      client.db.incr('quiz:total');
      emoji.forEach((emj) => {
        console.log(emj.charCodeAt(0));
        msg.react(emj);
      });
    })
  },
};