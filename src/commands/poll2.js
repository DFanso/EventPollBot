const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { createPoll } = require('../pollHandler');
const {admin} = require('../config.json')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll2')
        .setDescription('Create a new Event using command arguments')
        .addStringOption(option =>
            option.setName('name')
                  .setDescription('Event Name')
                  .setRequired(true))
        .addStringOption(option =>
            option.setName('desc')
                  .setDescription('Event Description')
                  .setRequired(true))
        .addStringOption(option =>
            option.setName('choices')
                  .setDescription('Choices (comma-separated)')
                  .setRequired(true)),
    
    async execute(interaction) {
        const eventName = interaction.options.getString('name');
        const eventDescription = interaction.options.getString('desc');
        const choices = interaction.options.getString('choices').split(',');

        // Creating the poll embed using MessageEmbed
        const pollEmbed = new MessageEmbed()
            .setTitle(eventName)
            .setDescription(`Description: ${eventDescription}\n\nPlease vote.`)
            .setColor('#E67E22')
            .setTimestamp()
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL());

        const buttons = choices.map(choice => {
            return new MessageButton()
                .setCustomId(`choice_${choice}`)
                .setLabel(choice)
                .setStyle('PRIMARY');
        });

        const actionRow = new MessageActionRow()
            .addComponents(buttons);

        await interaction.reply({ embeds: [pollEmbed], components: [actionRow] });
        
    },
    async execute(interaction) {
        
        const roleId = admin; 
        const member = interaction.member;      

        if (member.roles.cache.has(roleId)) {
            createPoll(interaction);
        } else {
            interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
            return;
        }
    }
    
};
