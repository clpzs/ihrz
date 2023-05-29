const { QuickDB } = require("quick.db");
const db = new QuickDB();
const {
    Client,
    Intents,
    Collection,
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType
} = require('discord.js');

module.exports = {
    name: 'prevnames',
    description: 'Lookup an Discord User, and see this previous username !',
    options: [{
        name: 'user', type: ApplicationCommandOptionType.User,
        description: 'user you want to lookup', required: true
    }],
    run: async (client, interaction) => {
        let user = interaction.options.getUser("user");

        const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
        let data = await getLanguageData(interaction.guild.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: data.prevnames_not_admin })

        let fetch = await db.get(`DB.PREVNAMES.${user.id}`);
        if (fetch) fetch = fetch.join('\n');
        
        let prevEmbed = new EmbedBuilder().setColor("#000000");
        prevEmbed.setTitle(data.prevnames_embed_title.replace("${user.username}", user.username));
        prevEmbed.setDescription(fetch || data.prevnames_undetected);
        prevEmbed.setFooter({ text: 'iHorizon', iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) });

        return interaction.reply({ embeds: [prevEmbed] });
    }
};