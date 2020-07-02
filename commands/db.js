module.exports = {
  name: 'db',
  description: 'Runs a db command',
  cooldown: 5,
  permLevel: 3,
  async run(client, message, args) {
    client.db[args[0]](args, function(err, res) {
      if(err) client.catch(err);
      message.channel.send(JSON.stringify(res));
    })
  },
};