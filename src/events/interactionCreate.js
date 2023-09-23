const { EmbedBuilder, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isCommand() && !interaction.isModalSubmit()) return;

    // Handle command interactions
    if (interaction.isCommand()) {
      try {
        const command = require(`../commands/${interaction.commandName}.js`);
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
      }
    }

    // Handle modal submission
if (interaction.isModalSubmit()) {
  if (interaction.customId === 'pollModal') {
    const eventName = interaction.components[0].components[0].value;
    const choices = interaction.components[1].components[0].value.split(',');

    // Create the poll embed using EmbedBuilder
    const pollEmbed = new EmbedBuilder()
      .setTitle(eventName)
      .setDescription('Please vote by commenting below.')
      .setColor(0x0099FF)
      .setTimestamp();

    // Send the poll embed without buttons
    await interaction.channel.send({ embeds: [pollEmbed] });

    await interaction.reply(`Poll created for event: ${eventName} with choices: ${choices.join(', ')}`);
  }
    }
  },
};
