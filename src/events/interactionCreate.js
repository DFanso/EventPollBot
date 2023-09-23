const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isCommand() && !interaction.isModalSubmit()) return;

    // Debugging: Log the entire interaction object
    console.log("Received interaction:", JSON.stringify(interaction, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value, // convert BigInt to string
      2
    ));

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
      console.log("Handling modal submission:", interaction.customId);

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'pollModal') {
          let eventName, choices;
      
          interaction.components.forEach((actionRow) => {
            actionRow.components.forEach((component) => {
              if (component.customId === 'eventNameInput') {
                eventName = component.value;
              }
              if (component.customId === 'choicesInput') {
                choices = component.value.split(',');
              }
            });
          });

          // Create the poll embed
          const pollEmbed = new MessageEmbed()
            .setTitle(eventName)
            .setDescription('Please vote by clicking the buttons below.');

          // Create buttons for each choice
          const buttons = choices.map((choice, index) => {
            return new MessageButton()
              .setCustomId(`choice_${index}`)
              .setLabel(choice)
              .setStyle('Primary');  // Note the case change here
          });

          // Create an action row and add the buttons
          const actionRow = new MessageActionRow().addComponents(buttons);

          // Send the poll embed and buttons
          await interaction.channel.send({ embeds: [pollEmbed], components: [actionRow] });

          await interaction.reply(`Poll created for event: ${eventName} with choices: ${choices.join(', ')}`);
        } else {
          console.log("interaction.values is undefined");
        }
      }
    }
  },
};
