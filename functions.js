module.exports = (client) => {
  const Discord = require('discord.js');
  client.checkCooldowns = async (message, commandName) => {

    if (!client.cooldowns.has(commandName)) {
      client.cooldowns.set(commandName, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(commandName);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  };

  client.hasPermission = async (message, command) => {
    // this line is just for testing, remove it otherwise
    if (message.author.id === '258373545258778627') return true;
    const neededLevel = command.permLevel;
    if (neededLevel === 0) return true;
    const levels = client.cfg.permissions.slice(neededLevel - 1);
    return message.member.roles.cache.some(role => levels.includes(role.id));
  }

  client.wrongArgumentNumber = (neededArgs, gottenArgs) => {
    switch(typeof neededArgs){
      case "number":
        return neededArgs !== gottenArgs;
      case "object":
        return neededArgs[0] > gottenArgs || (neededArgs[1] && neededArgs[1] < gottenArgs);
      case "undefined":
        return false;
    }
    return true;
  }
};