module.exports = {
  name: 'getreactors',
  description: "blah",
  cooldown: 5,
  permLevel: 0,
  async run(client, message, args){
    const channelID = args[0].split('/').slice(-2)[0];
    const channel = client.channels.cache.get(channelID);
    args.forEach((link) => {
      channel.messages.fetch(link.split('/').slice(-1)[0])
        .then((msg) => {
          msg.reactions.cache.first().users.fetch()
            .then((userCollection) => {
              const userList = userCollection.filter((user) => user.id !== msg.author.id).map(user => user.username);
              message.channel.send(`${userList.length} users reacted to message ${link}\n${userList.join('\n')}`);
            })
        })
    })
  }
};