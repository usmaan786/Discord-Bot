const {SlashCommandBuilder} = require('discord.js');
const { execute } = require('./hello');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube')
        .setDescription('Search for a youtube video')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('The search query')
                .setRequired(true)
        ),
    async execute(interaction){
        const query = interaction.options.getString('query');
        const maxResults = 1;
        const apiKey = process.env.YT_API_KEY;
        
        try{
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${apiKey}`);
            const data = await response.json();

            if(!data.items || data.items.length === 0){
                await interaction.reply(`No videos found for query: "${query}"`);
                return;
            }

            const video = data.items[0];
            const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
            const title = video.snippet.title;
            
            await interaction.reply(`**${title}**\n${videoUrl}`);
        }catch(error){
            console.error(error);
            await interaction.reply('An error occurred while searching for the video.');
        }
    },
};