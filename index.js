const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const fetch = require('node-fetch'); // To fetch data from GitHub API
require('dotenv').config(); // To securely load environment variables

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Base GitHub API URL and repository details
const GITHUB_API_URL = 'https://api.github.com/repos/';
const REPO_OWNER = 'your-github-username';
const REPO_NAME = 'your-repository-name';

// Handle commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'latestcommit') {
        const response = await fetch(`${GITHUB_API_URL}${REPO_OWNER}/${REPO_NAME}/commits`);
        const commits = await response.json();
        const latestCommit = commits[0];

        await interaction.reply(`Latest commit:\n\nMessage: ${latestCommit.commit.message}\nAuthor: ${latestCommit.commit.author.name}\nURL: ${latestCommit.html_url}`);
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'GitHub updates', type: ActivityType.Watching }],
        status: 'online',
    });
});

// Register commands
client.on('ready', async () => {
    const commands = [
        {
            name: 'latestcommit',
            description: 'Fetches the latest commit from the GitHub repository',
        },
    ];

    await client.application.commands.set(commands);
    console.log('Slash commands registered!');
});

// Login to Discord with your bot token
client.login(process.env.DISCORD_BOT_TOKEN);
