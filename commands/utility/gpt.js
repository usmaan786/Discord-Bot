const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Give ChatGPT a Query.')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Your question')
                .setRequired(true)
        ),
    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        const apiKey = process.env.OPENAI_API_KEY;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 200
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error(data.error);
                await interaction.reply(`Error: ${data.error.message}`);
                return;
            }

            const answer = data.choices[0]?.message?.content?.trim() ?? 'No response found.';

            await interaction.reply(answer.slice(0, 2000));
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while querying ChatGPT.');
        }
    },
};
