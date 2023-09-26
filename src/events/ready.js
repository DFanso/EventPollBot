const { Client, GatewayIntentBits,ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    execute(client) {
        client.user.setActivity('message', { type: ActivityType.Listening });
        client.user.setAvatar('https://d2cbg94ubxgsnp.cloudfront.net/Pictures/2000xAny/9/9/2/512992_shutterstock_715962319converted_749269.png');
      console.log('Bot is online!');
    },
  };
  