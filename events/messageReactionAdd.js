module.exports = async (client, messageReaction, user) => {
  if(user.bot) return;
  if(messageReaction.message.channel.id === client.cfg.quizChannel){
    messageReaction.users.remove(user.id);
    const member = messageReaction.message.guild.member(user);
    client.db.get(`quiz:${messageReaction.message.id}`, function (err, rightAnswer) {
      if(err) return client.catch(err);
      if(messageReaction.emoji.id !== rightAnswer && messageReaction.emoji.name !== rightAnswer) return;
      client.db.zadd(`users:${user.id}`, messageReaction.message.id, messageReaction.message.id, function (err, res) {
        if(err) return client.catch(err);
        if(res === 0) return;
        client.db.zcard(`users:${user.id}`, function(userCardinality) {
          client.db.get('quiz:total', function(quizCardinality) {
            if(userCardinality === quizCardinality) member.roles.add(client.cfg.watererRole);
          })
        })
      })
    })
  }
};