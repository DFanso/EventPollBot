const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  name: 'poll',
  description: 'Create a new Event',
  async execute(interaction) {
    // Create the modal
    const pollModal = new ModalBuilder()
      .setCustomId('pollModal')
      .setTitle('Create a new Event');

    // Create text input for event name
    const eventNameInput = new TextInputBuilder()
      .setCustomId('eventNameInput')
      .setLabel('Event Name')
      .setStyle(TextInputStyle.Short);

    // Create text input for choices
    const choicesInput = new TextInputBuilder()
      .setCustomId('choicesInput')
      .setLabel('Choices (comma-separated)')
      .setStyle(TextInputStyle.Paragraph);

      // Create text input for description
    const descriptionInput = new TextInputBuilder()
    .setCustomId('descriptionInput')
    .setLabel('Event Description')
    .setStyle(TextInputStyle.Paragraph);

    // Create action rows
    const firstActionRow = new ActionRowBuilder().addComponents(eventNameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(choicesInput);

    // Add components to the modal
    pollModal.addComponents(firstActionRow, secondActionRow,thirdActionRow);

    // Show the modal
    await interaction.showModal(pollModal);
  },
};
