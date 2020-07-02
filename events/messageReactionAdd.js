module.exports = async (client, messageReaction, user) => {
  if(user.bot) return;


  if(messageReaction.message.channel.id === client.cfg.quizChannel){
    messageReaction.users.remove(user.id).catch((err) => {client.catch(err)});
    const member = messageReaction.message.guild.member(user);
    if(member.roles.cache.has(client.cfg.readAgain)) return;
    client.db.hget('quiz', messageReaction.message.id, function(err, rightAnswer){
      if(err) return client.catch(err);
      if(messageReaction.emoji.id !== rightAnswer && messageReaction.emoji.name !== rightAnswer){
        client.db.zremrangebyscore(`users:${user.id}`, 1000, '+inf');
        member.roles.add(client.cfg.readAgain);
        return;
      }
      client.db.zadd(`users:${user.id}`, messageReaction.message.id, messageReaction.message.id, function (err, res) {
        if(err) return client.catch(err);
        if(res === 0) return;
        client.db.zcard(`users:${user.id}`, function(err, userCardinality) {
          if(err) return client.catch(err);
          client.db.hlen('quiz', function(err, quizCardinality) {
            if(err) return client.catch(err);
            if(userCardinality >= quizCardinality) member.roles.add(client.cfg.watererRole);
          })
        })
      })
    })
  }


  else if(messageReaction.message.id === client.cfg.readAgainMsg && messageReaction.emoji.id === client.cfg.readAgainEmoji){
    messageReaction.message.guild.member(user).roles.remove(client.cfg.readAgain, 'Asked for forgiveness')
      .catch((err) => {client.catch(err)});
  }
};