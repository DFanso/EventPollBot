const { EmbedBuilder, MessageActionRow, MessageButton,ButtonBuilder,ActionRowBuilder } = require('discord.js');

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
    const eventDescription =interaction.components[1].components[0].value;
    const choices = interaction.components[2].components[0].value.split(',');
      // Extracting the event description

    // Create the poll embed using EmbedBuilder
    const pollEmbed = new EmbedBuilder()
      .setTitle(eventName)
      .setDescription(`Description: ${eventDescription}\n\nPlease vote by commenting below.`)
      .setColor(0x0099FF)
      .setTimestamp();

      // Create buttons for each choice using ButtonBuilder
      const buttons = choices.map((choice, index) => {
        return new ButtonBuilder()
          .setCustomId(JSON.stringify({ffb:`choice_${index}`}))
          .setLabel(choice)
          .setStyle('Primary');
      });

      // Create an action row and add the buttons
      const actionRow = new ActionRowBuilder().addComponents(buttons);

     // Send the poll embed and buttons
     await interaction.channel.send({ embeds: [pollEmbed], components: [actionRow] });

     await interaction.reply(`Poll created for event: ${eventName} with choices: ${choices.join(', ')}`);
   
  }
    }
  },
};
