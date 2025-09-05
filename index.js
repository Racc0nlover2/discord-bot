const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const ROLE_ID = "1413427338233909269"; // your role ID
const TOKEN = process.env.DISCORD_TOKEN; // your bot token from .env

client.once(Events.ClientReady, () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
    if (message.content === "!setup") {
        const embed = new EmbedBuilder()
            .setTitle("🚨 You’ve Been Hit! 🚨")
            .setDescription(
`❗ Bad news—you just got caught slipping.

But good news—you can bounce back stronger and flip the script with us!

🔹 Here’s How to Recover & Strike Back:
1️⃣ Find a Cross-Trade  
Example: Swap Adopt Me items for MM2—fast, simple, and rewarding.

2️⃣ Use Our MM Server  
Our trusted middlemen keep trades secure and professional.

3️⃣ Make the Move  
Trade smart, stay safe, and stack your wins.`
            )
            .setColor("Red");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("green_button")
                .setLabel("✅ Accept")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("red_button")
                .setLabel("❌ Decline")
                .setStyle(ButtonStyle.Danger)
        );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "green_button" || interaction.customId === "red_button") {
        const role = interaction.guild.roles.cache.get(ROLE_ID);
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (!role) {
            return interaction.reply({ content: "⚠️ Role not found!", ephemeral: true });
        }

        if (member.roles.cache.has(ROLE_ID)) {
            return interaction.reply({ content: "You already have this role!", ephemeral: true });
        }

        await member.roles.add(role);
        await interaction.reply({ content: `✅ You got the role: ${role.name}`, ephemeral: true });
    }
});

client.login(TOKEN);
