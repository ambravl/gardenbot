module.exports = {
  name: 'changestar',
  description: "Changes a member's star level",
  usage: '@member <new level | +stars | -stars>',
  cooldown: 5,
  permLevel: 1,
  aliases: ['cs', 'stars', 'edits', 'editstars', 'changestars'],
  async run(client, message, args){
    let op = isNaN(args[1].charAt(0)) ? args[1].charAt(0) : false;
    const member = message.mentions.members.first();
    const currentRole = member.roles.cache.find((role) => role.name.slice(2) === "star");
    const currentStars = currentRole ? parseInt(currentRole.name.charAt(0)) : 0;
    let newStars = op ? args[1].slice(1) : args[1];
    if(isNaN(newStars)) return client.error('You need to provide a number!', message);
    newStars = parseInt(newStars);
    if(op === '+') {
      if (currentStars === 5) return client.error('Member is already at 5 stars!', message);
      newStars = Math.min(5, currentStars + newStars);
    }
    else if(op === '-') {
      if(currentStars === 0) return client.error('Member is already at 0 stars!', message);
      newStars = Math.max(0, currentStars - newStars);
    }
    else if(!op && currentStars === newStars) return client.error(`Member is already at ${currentStars} stars!`, message);
    const newPoints = client.cfg.starUp[newStars];
    client.db.zadd(`thanks:${member.id}`, newPoints, 'points');
    if(currentRole) member.roles.remove(currentRole);
    if(newStars !== 0) member.roles.add(message.guild.roles.cache.find((role) => role.name === `${newStars} star`));
    message.channel.send(`${member}'s star level has changed from **${currentRole ? currentRole.name : '0 star'}** to **${newStars} star**!`);
    // i wasn't sure if this should be a feature or not, uncomment it if it should
    // member.createDM().then((channel) => {channel.send(`Your star level has been changed from **${currentRole ? currentRole.name : '0 star'}** to **${newStars} star** by a mod!`)})
  }
};