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

const DataBaseModel = require(`${process.cwd()}/files/ihorizon-api/main.js`);

slashInfo.guildconfig.setjoinrole.run = async (client, interaction) => {
    const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
    let data = await getLanguageData(interaction.guild.id);

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({ content: data.setjoinroles_not_admin });
    }

    let query = interaction.options.getString("value")
    var roleid = interaction.options.get("roles")
    let help_embed = new EmbedBuilder()
        .setColor("#016c9a")
        .setTitle(data.setjoinroles_help_embed_title)
        .setDescription(data.setjoinroles_help_embed_description)

    if (query === "true") {
        if (!roleid) return interaction.reply({ embeds: [help_embed] });
        try {
            logEmbed = new EmbedBuilder()
                .setColor("#bf0bb9")
                .setTitle(data.setjoinroles_logs_embed_title_on_enable)
                .setDescription(data.setjoinroles_logs_embed_description_on_enable
                    .replace("${interaction.user.id}", interaction.user.id)
                );

            let logchannel = interaction.guild.channels.cache.find(channel => channel.name === 'ihorizon-logs');
            if (logchannel) { logchannel.send({ embeds: [logEmbed] }) }
        } catch (e) { logger.err(e) };

        try {
            // let already = await db.get(`${interaction.guild.id}.GUILD.GUILD_CONFIG.joinroles`);
            let already = await DataBaseModel({id: DataBaseModel.Get, key:`${interaction.guild.id}.GUILD.GUILD_CONFIG.joinroles`});
            if (already === roleid.value) return interaction.reply({ content: data.setjoinroles_already_on_enable })
            await db.set(`${interaction.guild.id}.GUILD.GUILD_CONFIG.joinroles`, roleid.value);

            return interaction.reply({
                content: data.setjoinroles_command_work_enable
                    .replace("${roleid}", roleid.value)
            });
        } catch (e) {
            return interaction.reply({ content: data.setjoinroles_command_error_on_enable });
        }
    } else {
        if (query === "false") {
            try {
                let ban_embed = new EmbedBuilder()
                    .setColor("#bf0bb9")
                    .setTitle(data.setjoinroles_logs_embed_title_on_disable)
                    .setDescription(data.setjoinroles_logs_embed_description_on_disable
                        .replace("${interaction.user.id}", interaction.user.id)
                    );
                let logchannel = interaction.guild.channels.cache.find(channel => channel.name === 'ihorizon-logs');
                logchannel.send({ embeds: [ban_embed] });
            } catch (e) { }

            try {
                // let already = await db.delete(`${interaction.guild.id}.GUILD.GUILD_CONFIG.joinroles`);
                let already = await DataBaseModel({id: DataBaseModel.Delete, key:`${interaction.guild.id}.GUILD.GUILD_CONFIG.joinroles`});
                if (!already) return interaction.reply({ content: data.setjoinroles_dont_need_command_on_disable })

                return interaction.reply({ content: data.setjoinroles_command_work_on_disable });

            } catch (e) {
                return interaction.reply({ content: data.setjoinroles_command_error_on_disable });
            }
        } else {
            if (query === "ls") {
                // let roles = await db.get(`${interaction.guild.id}.GUILD.GUILD_CONFIG.joinroles`)
                let roles = await DataBaseModel({id: DataBaseModel.Get, key:`${interaction.guild.id}.GUILD.GUILD_CONFIG.joinroles`})
                if (!roles) return interaction.reply({ content: data.setjoinroles_command_any_set_ls })
                return interaction.reply({
                    content: data.setjoinroles_command_work_ls
                        .replace("${roles}", roles)
                });
            } else {
                interaction.reply({ embeds: [help_embed] });
            }
        }
    }
};

module.exports = slashInfo.guildconfig.setjoinrole;