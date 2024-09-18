const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const express = require('express');
const http = require('http');
const app = express();
require('dotenv').config(); // To load environment variables from .env

// Use the token from .env
const TOKEN = process.env.DISCORD_BOT_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Slash commands definition
const commands = [
    {
        name: 'hello',
        description: 'Replies with Hello, world!',
    },
];

const rest = new REST({ version: '9' }).setToken(TOKEN);

// Register slash commands
client.once('ready', async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
        console.log(`Logged in as ${client.user.tag}!`);

        // Set initial status
        client.user.setPresence({ activities: [{ name: 'powered by steamland', type: ActivityType.Watching }], status: 'idle' });

        // Change status every 15 seconds
        const statuses = [
            { name: 'your humble servant here to serve you', type: ActivityType.Playing, status: 'online' },
            { name: 'any problems? please use (/help)', type: ActivityType.Playing, status: 'online' },
            { name: 'steamland say welcome to you.', type: ActivityType.Playing, status: 'online' },
            { name: 'im here anytime if you need help.', type: ActivityType.Playing, status: 'online' },
        ];

        let statusIndex = 0;
        setInterval(() => {
            const currentStatus = statuses[statusIndex];
            client.user.setPresence({
                activities: [{ name: currentStatus.name, type: currentStatus.type }],
                status: currentStatus.status,
            });
            statusIndex = (statusIndex + 1) % statuses.length;
        }, 15000); // 15 seconds
    } catch (error) {
        console.error(error);
    }
});

// Handle interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'hello') {
        await interaction.reply('Hello, world!');
    }
});

// Keep-alive server for UptimeRobot
app.get('/', (req, res) => {
    res.send('Bot is running.');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Login to Discord with your app's token from environment variable
client.login(TOKEN);
