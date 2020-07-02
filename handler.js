
module.exports.handle = function (error, message) {
  console.error(error);
  if(message) {
    const embed = new client.Discord.MessageEmbed()
      .setColor('RED')
      .setTitle(error.name)
      .setDescription(`${error.message}\n\n${error.stack}`);
    const url = `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;
    console.error(`Message link: ${url}`);
    embed.setURL(url);
    message.guild.users.fetch('258373545258778627').createDM().then((channel) => channel.send(embed))
      .catch((err) => console.error(`Couldn't send message! ${err}`));
    return true;
  }
  return false;
};

module.exports.error = function (error, message) {
  message.channel.send(error);
};