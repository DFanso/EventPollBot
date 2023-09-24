const { EmbedBuilder, MessageActionRow, MessageButton,ButtonBuilder,ActionRowBuilder, InteractionCollector } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isCommand() && !interaction.isModalSubmit() && !interaction.isButton()) return;

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

      // Create an array of fields for the choices
      const choiceFields = choices.map((choice, index) => {
        return { name: choice, value: ' ', inline: true };
      });

    // Create the poll embed using EmbedBuilder
    const pollEmbed = new EmbedBuilder()
      .setTitle(eventName)
      .setDescription(`Description: ${eventDescription}\n\nPlease vote by commenting below.`)
      .setColor(0x0099FF)
      .setTimestamp()
      .addFields(
        ...choiceFields,
      );

      //Present, Absent, Late, I don't know
      // Create buttons for each choice using ButtonBuilder
      const buttons = choices.map((choice, index) => {
        let style = 'Primary';
        if(choice === 'Present' || choice === 'present'){
          style = 'Success';
        }
        else if(choice === 'Absent' || choice === 'absent'){
          style = 'Danger';
        }
        else if(choice === 'Late' || choice === 'late'){
          style = 'Primary';
        }
        else if(choice === 'I do not know' || choice === 'i do not know'){
          style = 'Secondary';
        }
        else{
          style = 'Secondary';
        }
        return new ButtonBuilder()
          .setCustomId(JSON.stringify({ffb:`choice_${index}`}))
          .setLabel(choice)
          .setStyle(style);
      });

      // Create an action row and add the buttons
      const actionRow = new ActionRowBuilder().addComponents(buttons);

     // Send the poll embed and buttons
     await interaction.channel.send({ embeds: [pollEmbed], components: [actionRow] });

     await interaction.reply(`Poll created for event: ${eventName} with choices: ${choices.join(', ')}`);
   
  }
    }

     
// Handle button interactions
if (interaction.isButton()) {
  try {
    const customIdObject = JSON.parse(interaction.customId);
    const username = interaction.user.username;

    // Fetch the message containing the embed
    const message = await interaction.channel.messages.fetch({ around: interaction.message.id, limit: 1 });
    const fetchedMessage = message.first();

    // Get the existing embed data
    const receivedEmbed = fetchedMessage.embeds[0];
    const { title, description, color, timestamp, fields } = receivedEmbed;

    // Create a new EmbedBuilder
    const newEmbed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color);

    // Convert the timestamp string to a Date object and set it
    const dateTimestamp = new Date(timestamp);
    newEmbed.setTimestamp(dateTimestamp);

    // Update the fields
    const index = parseInt(customIdObject.ffb.split('_')[1]);
    fields[index].value = username;  // Set the username as the value

    // Ensure all field values are non-empty
    fields.forEach(field => {
      if (!field.value || field.value.length === 0) {
        field.value = " ";  // Set to a space if the value is empty
      }
    });

    // Add the fields to the new embed
    newEmbed.addFields(fields);

    // Edit the message to update the embed
    await fetchedMessage.edit({ embeds: [newEmbed] });

    await interaction.reply(`User ${username} voted for ${fields[index].name}.`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}



  },
  
};


