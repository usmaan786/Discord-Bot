const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
//require('dotenv').config();
const {token} = require('./config.json');

const cooldowns = new Map();
const cooldownTime = 3500;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, 
    ],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders){
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for(const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        }
        else{
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const ignoredUsers = ['736363083739431033'];

    if(ignoredUsers.includes(interaction.user.id)){
        console.log(`Ignoring command from user: ${interaction.user.displayName}`);
        return;
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error(`No command matching ${interaction.commandName} was not found.`);
        return;
    }

    try{
        await command.execute(interaction);
        console.log(`Command ${interaction.commandName} was executed by ${interaction.user.displayName}`);
    }catch(error){
        console.error(error);
        if(interaction.replied || interaction.deferred){
            await interaction.followUp({content: `There was an error while executing this command`, flags: MessageFlags.Ephemeral});
        }
        else{
            await interaction.reply({content: `There was an error while executing this command`, flags: MessageFlags.Ephemeral});
        }
    }
    
});


client.login(token);