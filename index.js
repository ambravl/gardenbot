// this line should be removed when deploying to heroku
require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client(
  {presence: { activity: { name: "everyone", type: 'LISTENING' }}});

const handler = require('./handler');
client.catch = handler.handle;
client.error = handler.error;

const redis = require('redis');
client.db = redis.createClient(process.env.REDISTOGO_URL, {no_ready_check: true});
client.db.hgetall('config', (err, res) => {
  if(err) client.catch(err);
  client.cfg = res;
});

client.db.lrange('config:perms', 0, -1, (err, res) => {
  if(err) client.catch(err);
  client.cfg.permissions = res;
});

client.db.lrange('config:stars', 0, -1, (err, res) => {
  if(err) client.catch(err);
  client.cfg.starUp = res;
});


client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
require('./functions')(client);

fs.readdirSync('./commands').filter(file => file.endsWith('.js')).forEach((file) => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
});

fs.readdirSync('./events').filter(file => file.endsWith('.js')).forEach((file) => {
  client.on(file.split('.')[0], require(`./events/${file}`).bind(null, client))
});


client.login(process.env.BOT_TOKEN).catch((err) => {client.catch(err)});