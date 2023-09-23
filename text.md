```js
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'poll') {
    // Create Embed
    const pollEmbed = new MessageEmbed()
      .setTitle('Event Name')
      .setDescription('Who will be present?');

    // Create Buttons
    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('present')
          .setLabel('Present')
          .setStyle('PRIMARY'),
      );

    await interaction.reply({ embeds: [pollEmbed], components: [buttons] });
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const { customId } = interaction;

  if (customId === 'present') {
    // Get the original embed and modify it
    const originalEmbed = interaction.message.embeds[0];
    const newEmbed = new MessageEmbed(originalEmbed)
      .addField('Present:', `${interaction.user.tag}`);

    await interaction.update({ embeds: [newEmbed] });
  }
});

// Register command
const commands = [{
  name: 'poll',
  description: 'Create a poll',
}];

const rest = new REST({ version: '9' }).setToken('YOUR_BOT_TOKEN');

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands('YOUR_CLIENT_ID', 'YOUR_GUILD_ID'),
      { body: commands },
    );

    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.login('YOUR_BOT_TOKEN');

```