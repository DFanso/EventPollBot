const { EmbedBuilder, ButtonBuilder,ActionRowBuilder } = require('discord.js');

async function createPoll(interaction) {
    const eventName = interaction.options.getString('name');
    const eventDescription = interaction.options.getString('desc');
    const choices = interaction.options.getString('choices').split(',');

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

module.exports = { createPoll };
