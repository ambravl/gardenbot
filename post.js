const postFields = require('./postfields.json');

class Post {

  constructor(client, message) {
    this.creatorId = message.author.id;
    this.messageId = message.id;
    const content = message.content.slice(client.cfg.prefix.length + 'new'.length + 1);
    this.queue = message.command === client.cfg.prefix + 'queue';
    this.types = this.getTypes(content);
    this.fields = this.getFields(content);
    this.timeout = this.fields.timeout;
    if(this.timeout) delete this.fields.timeout;
    if(this.queue){
      this.dodo = this.fields.dodo;
      delete this.fields.dodo;
    }

  }

  getTypes(content){
    let types = content.match(/(types?|cats?|category|categories): ?(.+)/i)[2];
    if(types) types.split(/\W+|and/).filter((match) => match);
    return (types && types.length > 0) ? types : ['common'];
  }

  getFields(content){
    const fields = {other: []};
    let possibleFields = [];
    this.types.forEach((type) => {
      possibleFields = possibleFields.concat(postFields.types[type]);
    });
    const regex = [];
    possibleFields.forEach((field) => {
      regex.push(postFields[field].regex);
    });
    const regexp = new RegExp(`(?:(?:${regex.join("|")}): ?(?<data>.+))|(?<more>^[^:]+$)`, "gim");
    const matches = content.matchAll(regexp);
    for(const match of matches) {
      if(match.groups.more || match.groups.other) this.fields.other.push(match.groups.more || match.groups.data);
      else{
        const fieldName = Object.keys(match.groups).find((name) => name !== 'data');
        fields[fieldName] = match.groups.data;
      }
    }
    possibleFields.forEach((field) => {
      if(!fields[field]) {
        if (postFields[field].default) fields[field] = postFields[field].default;
        // TODO
        else if(postFields[field].required) pass;
      }
    });
    fields.other = fields.other.join('\n');
    if(fields.other === '') delete fields.other;
    return fields;
  }

  createPosts(client){
    this.types.forEach((type) => {this.createPost(type, client)})
  }

  createPost(type, client){
    const message = [];
    const possibleFields = type === 'common' ? postFields[type] : postFields[type].concat(postFields['common']);
    // i'm using possibleFields instead of this.fields because possibleFields is ordered
    possibleFields.forEach((field) => {
      if(this.fields[field]) message.push(`**${postFields[field].title}** ${this.fields[field]}`)
    });
    const channel = client.channels.cache.find((channel) => channel.id === client.cfg[`${type}Channel`]);
    if(channel) channel.send(message.join('\n'))
      .then((msg) => {
        client.db.set(`post:${this.messageId}`, this.dodo || this.fields.dodo);
        client.db.expire(`post:${this.messageId}`, client.cfg.postttl);
        client.db.zadd(`posts`, msg.createdTimestamp, msg.id);
      })
  }
}