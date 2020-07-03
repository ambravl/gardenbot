module.exports = async (client, message) => {
  if (!message.content.startsWith(client.cfg.prefix) || message.author.bot) return;

  const args = message.content.slice(client.cfg.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  console.log(`${message.author.username} tried running ${command.name} in ${message.channel.name || 'DMs'}!`);

  if (!(command && client.hasPermission(message, command))) return client.error('No commands found with that name!');

  message.content = message.content.slice(client.cfg.prefix.length + commandName.length).trim();
  message.commmand = commandName;

  if (command.guildOnly && !message.guild) {
    return client.error('I can\'t execute that command inside DMs!', message);
  }

  if(client.wrongArgumentNumber(command.args, args.length))
      return client.error(
        `Wrong number of arguments, ${message.author}!` +
        command.usage ? `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\`` : '',
        message
      );

  try {
    command.run(client, message, args);
  } catch (error) {
    client.catch(error, message);
    client.error('there was an error trying to execute that command!', message);
  }
};