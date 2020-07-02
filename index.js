// this line should be removed when deploying to heroku
require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client(
  {presence: { activity: { name: "everyone", type: 'LISTENING' }}});

const redis = require('redis');
client.db = redis.createClient(process.env.REDISTOGO_URL, {no_ready_check: true});
client.cfg = require('./config.json');
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
require('./functions')(client);
const handler = require('./handler');
client.catch = handler.handle;
client.error = handler.error;

fs.readdirSync('./commands').filter(file => file.endsWith('.js')).forEach((file) => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
});

fs.readdirSync('./events').filter(file => file.endsWith('.js')).forEach((file) => {
  client.on(file.split('.')[0], require(`./events/${file}`).bind(null, client))
});


client.login(process.env.BOT_TOKEN).catch((err) => {client.catch(err)});