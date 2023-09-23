const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'modalSubmit',
  async execute(interaction, client) {
    if (interaction.customId !== 'pollModal') return;

    const eventName = interaction.values.get('eventNameInput');
    const choices = interaction.values.get('choicesInput').split(',');

    // Create the poll embed
    const pollEmbed = new MessageEmbed()
      .setTitle(eventName)
      .setDescription('Please vote by clicking the buttons below.');

    // Create buttons for each choice
    const buttons = choices.map((choice, index) => {
      return new MessageButton()
        .setCustomId(`choice_${index}`)
        .setLabel(choice)
        .setStyle('PRIMARY');
    });

    // Create an action row and add the buttons
    const actionRow = new MessageActionRow().addComponents(buttons);

    // Send the poll embed and buttons
    await interaction.channel.send({ embeds: [pollEmbed], components: [actionRow] });

    // Reply to the interaction to confirm the poll creation
    await interaction.reply(`Poll created for event: ${eventName} with choices: ${choices.join(', ')}`);
  },
};
