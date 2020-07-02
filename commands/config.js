module.exports = {
  name: 'config',
  description: 'Changes or reads a configuration value',
  usage: 'new <(only if this is a new configuration)> <config name (optional)> <new value (optional)>',
  cooldown: 5,
  permLevel: 2,
  async run(client, message, args) {
    if(!args || args.length === 0){
      const msg = [];
      Object.keys(client.cfg).forEach((config) => {
        msg.push(`**${config}:** ${client.cfg[config]}`);
      });
      if(msg.length < 1) return client.error('No results!');
      return message.channel.send(`**Current Configurations:** ${msg.join('\n')}`)
          .catch((err) => {client.catch(err, message)});
    }
    if(args.length === 1) {
      const value = client.cfg[args[0]];
      if(!value) return client.error('No matches!', message);
      return message.channel.send(`**${args[0]}**: ${value}`);
    }
    if(args[0].toLowerCase() === 'new') {
      const value = args.slice(2).join(' ');
      client.db.hset('config', args[1], value);
      client.cfg[args[1]] = value;
      message.channel.send(`**${args[1]}** created and set to ${value}`);
    }
    else{
      if(args[0] === 'permissions' || args[0] === 'starUp'){
        if(args.length > 2) {
          client.db.lset(args[0], parseInt(args[1]), args[2]);
          client.cfg[args[0]][parseInt(args[1])] = args[2];
          return message.channel.send(`${args[1]} edited to ${args[2]}!`)
        }
        else {
          client.db.lpush(args[0], args[1]);
          client.cfg[args[0]] = args[1];
          return message.channel.send(`${args[1]} pushed to the ${args[0]} list!`)
        }
      }
      client.db.hexists('config', args[0], (err, res) => {
        if(err) return client.catch(err, message);
        if(!res) return client.error("No such config! Write 'new' before the config name if you want to create a new configuration!", message);
        const value = args.shift().join(' ');
        client.db.hset('config', args[0], value);
        client.cfg[args[0]] = value;
        message.channel.send(`**${args[0]}** set to ${value}`);
      });
    }
  }
};