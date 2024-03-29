const { EmbedBuilder, MessageActionRow, MessageButton,ButtonBuilder,ActionRowBuilder, InteractionCollector } = require('discord.js');
const {admin,image,thumbnail} = require('../config.json')
const userButtonMap = {};
const userLoopMap = {}; 


// Function to start a repeating event
function startRepeatingEvent(channel, embed, actionRow, userId, eventName) {
  // Create a new embed with the users removed from the fields
  const newEmbed = new EmbedBuilder()
    .setTitle(embed.title)
    .setDescription(embed.description)
    .setColor(embed.color)
    .setAuthor(embed.author)
    .setThumbnail(embed.thumbnail.url)
    .setImage(embed.image.url)
    .setTimestamp(new Date(embed.timestamp))
    .addFields(
      embed.fields.map(field => ({
        name: field.name,
        value: ' ',  // Reset the value
        inline: field.inline
      }))
    );

  const intervalId = setInterval(async () => {
    await channel.send({ embeds: [newEmbed], components: [actionRow] });
  }, 60 * 1000);  // 1 minute in milliseconds

  // Store the intervalId for the specific event
  if (!userLoopMap[userId]) {
    userLoopMap[userId] = {};
  }
  userLoopMap[userId][eventName] = intervalId;
}


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
      .setColor(0xE67E22)
      .setTimestamp()
      .setThumbnail(thumbnail)
      .setImage(image)
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.org' })
      .addFields(
        ...choiceFields,
      );

      //Present, Absent, Late, I don't know
      // Create buttons for each choice using ButtonBuilder
      const buttons = choices.map((choice, index) => {
        let style = 'Primary';
        if(choice === '✅ Present' || choice === 'present'){
          style = 'Success';
        }
        else if(choice === '❌ Absent' || choice === 'absent'){
          style = 'Danger';
        }
        else if(choice === '⌚ Late' || choice === 'late'){
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

      const loopButton = new ButtonBuilder()
      .setCustomId('loopEvent')
      .setLabel('Loop')
      .setStyle('Secondary');

      const stopLoopButton = new ButtonBuilder()
      .setCustomId('stopLoopEvent')
      .setLabel('Stop Loop')
      .setStyle('Danger');

      // Create an action row and add the buttons
      const actionRow = new ActionRowBuilder().addComponents([...buttons, loopButton, stopLoopButton]);

     // Send the poll embed and buttons
     await interaction.channel.send({ embeds: [pollEmbed], components: [actionRow] });

     await interaction.reply(`Poll created for event: ${eventName} with choices: ${choices.join(', ')}`);
   
  }
    }

    
// Handle button interactions
if (interaction.isButton()) {
        const roleId = admin; 
        const member = interaction.member;  
  

  if (!userLoopMap[interaction.user.id]) {
    userLoopMap[interaction.user.id] = {};
  }


  // Fetch the message to get the embed
  const message = await interaction.channel.messages.fetch({ around: interaction.message.id, limit: 1 });
  const fetchedMessage = message.first();
  const receivedEmbed = fetchedMessage.embeds[0];


  if (member.roles.cache.has(roleId) && interaction.customId === 'loopEvent' ) {
    // Defer the interaction
    await interaction.deferReply({ ephemeral: true });

    // Capture the current embed and action row
    const message = await interaction.channel.messages.fetch({ around: interaction.message.id, limit: 1 });
    const fetchedMessage = message.first();
    const currentEmbed = fetchedMessage.embeds[0];
    const currentActionRow = fetchedMessage.components[0];  
    const eventName = currentEmbed.title;  

    // Start the repeating event
    startRepeatingEvent(interaction.channel, currentEmbed, currentActionRow, interaction.user.id, eventName);

    // Follow up after deferring
    await interaction.followUp({ content: `Event will now repeat every 1 minute.`, ephemeral: true });
  } else if (member.roles.cache.has(roleId) && interaction.customId === 'stopLoopEvent') {
    // Defer the interaction
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;

        const eventName = receivedEmbed.title;  // Unique identifier for the event
         if (userLoopMap[userId] && userLoopMap[userId][eventName]) {
        clearInterval(userLoopMap[userId][eventName]);
        delete userLoopMap[userId][eventName];

      await interaction.followUp({ content: `Event will no longer repeat.`, ephemeral: true });
    } else {
      await interaction.followUp({ content: `No repeating event to stop.`, ephemeral: true });
    }
  }
  else {
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
  
      // Check if the new choice is the same as the previous choice
      if (userButtonMap.hasOwnProperty(userId) && userButtonMap[userId] === index) {
        // Remove the user's name from the list
        const prevUsers = fields[index].value.split('\n');  // Split by newline
        const newPrevUsers = prevUsers.filter(u => u !== userMention).join('\n');  // Join by newline
        fields[index].value = newPrevUsers;
  
        // Update the user-button map to indicate no current choice
        delete userButtonMap[userId];
  
        await interaction.followUp({ content: `You removed your vote for ${choice}`, ephemeral: true });
      } else {
        // Add the new choice
        fields[index].value = fields[index].value ? `${fields[index].value}\n${userMention}` : userMention;
  
        // Update the user-button map
        userButtonMap[userId] = index;
  
        await interaction.followUp({ content: `You voted for ${choice}`, ephemeral: true });
      }
  
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
        .setThumbnail(receivedEmbed.thumbnail.url)
        .setImage(receivedEmbed.image.url)
        .setTimestamp(new Date(receivedEmbed.timestamp))
        .addFields(fields);
  
      await fetchedMessage.edit({ embeds: [newEmbed] });
  
    } catch (error) {
      console.error("An error occurred:", error);
    }

  }
}

  },
  
};


