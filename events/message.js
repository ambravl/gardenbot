module.exports = async (client, message) => {
  if (!message.content.startsWith(client.cfg.prefix) || message.author.bot) return;

  const args = message.content.slice(client.cfg.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!(command && client.hasPermission(message, command))) return;

  if (command.guildOnly && !message.guild) {
    return client.error('I can\'t execute that command inside DMs!', message);
  }

  if (command.args && args.length < 1) {
    return client.error(
      `You didn't provide any arguments, ${message.author}!` +
      command.usage ? `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\`` : '',
      message
    )
  }

  try {
    command.run(client, message, args);
  } catch (error) {
    client.catch(error, message);
    client.error('there was an error trying to execute that command!', message);
  }
};