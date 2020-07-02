module.exports = {
  name: 'thanks',
  description: 'Thanks an user so they can unlock more channels',
  cooldown: 5,
  permLevel: 0,
  aliases: ['thank', 'ty'],
  async run(client, message) {
    const thanked = message.mentions.members.first();
    client.db.zscore(`thanks:${thanked.id}`, message.author.id, function (err, res) {
      if (err) return client.catch(err, message);
      if (res && res !== '(nil)' && message.createdTimestamp - parseInt(res) < client.cfg.thankLimit)
        return client.error('You already thanked this person!', message);
      client.db.zadd(`thanks:${thanked.id}`, message.createdTimestamp, message.author.id);
      client.db.zincrby(`thanks:${thanked.id}`, 1, 'points', (err, res) => {
        if(err) return client.catch(err, message);
        const i = client.cfg.starUp.indexOf(parseInt(res));
        if(i === -1) return message.channel.send(`Successfully thanked ${thanked}!`);
        thanked.roles.add(message.guild.roles.cache.find((role) => role.name === `${i} star`));
        if(i !== 1) thanked.roles.remove(message.guild.roles.cache.find((role) => role.name === `${i-1} star`));
        message.channel.send(`Congratulations, ${thanked}! You just leveled up to ${i} stars!`)
      });
    })
  }
};