const { Client, Collection, EmbedBuilder, Permissions } = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);

module.exports = async (client, oldMessage, newMessage) => {
    let data = await getLanguageData(oldMessage.guild.id)
    async function serverLogs() {
        if (!oldMessage) return;
        if (!oldMessage.guild) return;

        const guildId = oldMessage.guildId;
        const someinfo = await db.get(`${guildId}.GUILD.SERVER_LOGS.message`);

        if (!someinfo) return;
        if(!oldMessage.content || !newMessage.content ) return;
        let logsEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setAuthor({ name: newMessage.author.username, iconURL: newMessage.author.avatarURL({ format: 'png', dynamic: true, size: 512 }) })
            .setDescription(data.event_srvLogs_messageUpdate_description
                .replace("${oldMessage.channelId}", oldMessage.channelId)
            )
            .setFields({ name: data.event_srvLogs_messageUpdate_footer_1, value: oldMessage.content},
                { name: data.event_srvLogs_messageUpdate_footer_2, value: newMessage.content})
            .setTimestamp();

        await client.channels.cache.get(someinfo).send({ embeds: [logsEmbed] }).catch(() => { });
    };

    await serverLogs();
};