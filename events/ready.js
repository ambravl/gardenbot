module.exports = async (client) => {
  client.db.hkeys('quiz', function(err, res) {
    if(err) return client.catch(err);
    if(!res || !client.cfg.quizChannel) return;
    client.channels.fetch(client.cfg.quizChannel).then((channel) => {
      if(!channel) return;
      res.forEach((messageID) => {
        channel.messages.fetch(messageID).then(() => {
          console.log(`fetched ${messageID}`)
        })
      })
    })
  });
  if(client.cfg.readAgainChannel) client.channels.resolve(client.cfg.readAgainChannel).messages.fetch(client.cfg.readAgainMsg).catch((err) => {client.catch(err)});
  console.log('ready');
};