module.exports = {
  name: 'thanks',
  description: 'Thanks an user so they can unlock more channels',
  cooldown: 5,
  permLevel: 0,
  async run(client, message) {
    const thanked = message.mentions.first();
    client.db.zadd(`thanks:${thanked.id}`, 1, message.author.id, function (err, res) {
      if(err) return client.catch(err);
      if(res === 0) return client.error('You already thanked this person!', message);
    })

  },
};