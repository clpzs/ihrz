/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2023 iHorizon
*/

const slashInfo = require(`${process.cwd()}/files/ihorizon-api/slashHandler`);

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

const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);

slashInfo.economy.removemoney.run = async (client, interaction) => {
        let data = await getLanguageData(interaction.guild.id);
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: data.removemoney_not_admin })
        };

        var amount = interaction.options.getNumber("amount")
        let user = interaction.options.get("member")
        await db.sub(`${interaction.guild.id}.USER.${user.user.id}.ECONOMY.money`, amount)
        let bal = await db.get(`${interaction.guild.id}.USER.${user.user.id}.ECONOMY.money`)

        let embed = new EmbedBuilder()
            .setAuthor({ name: data.removemoney_embed_title, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png` })
            .addFields({ name: data.removemoney_embed_fields, value: `${amount}$` },
                { name: data.removemoney_embed_second_fields, value: `${bal}$` })
            .setColor("#bc0116")
            .setTimestamp()

        try {
            logEmbed = new EmbedBuilder()
                .setColor("#bf0bb9")
                .setTitle(data.removemoney_logs_embed_title)
                .setDescription(data.removemoney_logs_embed_description
                    .replace(/\${interaction\.user\.id}/g, interaction.user.id)    
                    .replace(/\${amount}/g, amount)    
                    .replace(/\${user\.user\.id}/g, user.user.id)    
                    )

            let logchannel = interaction.guild.channels.cache.find(channel => channel.name === 'ihorizon-logs');
            if (logchannel) { logchannel.send({ embeds: [logEmbed] }) };
        } catch (e) { return; };

        return interaction.reply({ embeds: [embed] });
};

module.exports = slashInfo.economy.removemoney;