const { EmbedBuilder, MessageActionRow, MessageButton,ButtonBuilder,ActionRowBuilder, InteractionCollector } = require('discord.js');
const userButtonMap = {};

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
      .setDescription(`Description: ${eventDescription}\n\nPlease vote.`)
      .setColor(0x0099FF)
      .setTimestamp()
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.org' })
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

    await interaction.deferUpdate();

    const customIdObject = JSON.parse(interaction.customId);
    const userId = interaction.user.id;
    const userMention = `<@${userId}>`;

    const message = await interaction.channel.messages.fetch({ around: interaction.message.id, limit: 1 });
    const fetchedMessage = message.first();
    const receivedEmbed = fetchedMessage.embeds[0];
    const { fields } = receivedEmbed;


      // Remove previous choice if exists
    if (userButtonMap.hasOwnProperty(userId)) {
      const prevIndex = userButtonMap[userId];
      const prevUsers = fields[prevIndex].value.split('\n');  // Split by newline
      const newPrevUsers = prevUsers.filter(u => u !== userMention).join('\n');  // Join by newline
      fields[prevIndex].value = newPrevUsers;
    }

  
  // Add new choice
  const index = parseInt(customIdObject.ffb.split('_')[1]);
  const choice = fields[index].name; 
  fields[index].value = fields[index].value ? `${fields[index].value}\n${userMention}` : userMention;

  // Update the user-button map
  userButtonMap[userId] = index;

    // Ensure all field values are non-empty and trim extra spaces
    fields.forEach(field => {
      if (!field.value || field.value.length === 0) {
        field.value = " ";
      } else {
        field.value = field.value.trim();
      }
    });

    // Create a new EmbedBuilder and add the updated fields
    const newEmbed = new EmbedBuilder()
      .setTitle(receivedEmbed.title)
      .setDescription(receivedEmbed.description)
      .setColor(receivedEmbed.color)
      .setAuthor(receivedEmbed.author)
      .setTimestamp(new Date(receivedEmbed.timestamp))
      .addFields(fields);

    await fetchedMessage.edit({ embeds: [newEmbed] });
    await interaction.followUp({ content: `You voted for ${choice}`, ephemeral: true });

  } catch (error) {
    console.error("An error occurred:", error);
  }
}




  },
  
};


