module.exports = {
  name: 'ping',
  description: 'Pings the bot',
  cooldown: 5,
  permLevel: 0,
  async run(client, message) {
    message.channel.send('Pong!').then((msg) => {
      msg.edit(`Pong! (${msg.createdTimestamp - message.createdTimestamp}ms)`)
    });
  },
};