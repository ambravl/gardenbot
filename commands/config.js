module.exports = {
  name: 'config',
  description: 'Changes or reads a configuration value',
  usage: 'new <(only if this is a new configuration)> <config name (optional)> <new value (optional)>',
  cooldown: 5,
  permLevel: 2,
  async run(client, message, args) {
    if(!args || args.length === 0){
      client.db.hgetall('config', function(err, res) {
        if(err) return client.catch(err, message);
        if(!res) return client.error('No results!');
        const msg = [];
        for(let i = 0; i < res.length; i+=2){
          msg.push(`**${res[i]}:** ${res[i+1]}`)
        }
        message.channel.send(`**Current Configurations:** ${msg.join('\n')}`)
          .catch((err) => {client.catch(err, message)});
      });
      return;
    }
    if(args.length === 1) {
      client.db.hget('config', args[0], (err, res) => {
        if (err) return client.catch(err, message);
        if (!res || res === '(nil)') return client.error('No matches!', message);
        message.channel.send(`**${args[0]}**: ${res}`);
      });
      return;
    }
    if(args[0].toLowerCase() === 'new') {
      const value = args.slice(2).join(' ');
      client.db.hset('config', args[1], value);
      message.channel.send(`**${args[1]}** created and set to ${value}`);
    }
    else{
      client.db.hexists('config', args[0], (err, res) => {
        if(err) return client.catch(err, message);
        if(!res) return client.error("No such config! Write 'new' before the config name if you want to create a new configuration!", message);
        const value = args.shift().join(' ');
        client.db.hset('config', args[0], value);
        message.channel.send(`**${args[0]}** set to ${value}`);
      });
    }
  }
};