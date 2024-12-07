const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Replies to greetings'),
	async execute(interaction) {
		await interaction.reply('Hi');
	},
};