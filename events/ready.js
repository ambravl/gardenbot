module.exports = async (client) => {
  client.db.hkeys('quiz', function(err, res) {
    if(err) return client.catch(err);
    const channel = client.channels.resolve(client.cfg.quizChannel);
    res.forEach((messageID) => {
      channel.messages.fetch(messageID).then(()=>{console.log(`fetched ${messageID}`)})
    })
  });
  console.log('ready')
};