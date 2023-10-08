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

import {
    Client,
    EmbedBuilder,
    PermissionsBitField
} from 'discord.js';

export = {
    run: async (client: Client, interaction: any, data: any) => {

        let id = interaction.options.getString("id");
        let message = interaction.options.getString("reason");

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.editReply({ content: data.suggest_accept_not_admin });
            return;
        };

        let baseData = await client.db.get(`${interaction.guild.id}.SUGGEST`);
        let fetchId = await client.db.get(`${interaction.guild.id}.SUGGESTION.${id}`);

        if (!baseData
            || baseData?.channel !== interaction.channel.id
            || baseData?.disable === true) {
            await interaction.deleteReply();
            await interaction.followUp({
                content: data.suggest_acceptnot_good_channel
                    .replace('${baseData?.channel}', baseData?.channel),
                ephemeral: true
            });

            return;
        };

        if (!fetchId) {
            await interaction.deleteReply();
            await interaction.followUp({ content: data.suggest_accept_not_found_db, ephemeral: true });
            return;
        } else if (fetchId.replied) {
            await interaction.deleteReply();
            await interaction.followUp({ content: data.suggest_accept_already_replied, ephemeral: true });
            return;
        };

        let channel = interaction.guild.channels.cache.get(baseData?.channel);

        await channel.messages.fetch(fetchId?.msgId).then(async (msg: any) => {

            let embed = new EmbedBuilder(msg.embeds[0].data);

            embed.addFields({
                name: data.suggest_accept_embed_fields_to_put
                    .replace('${interaction.user.username}', interaction.user.globalName),
                value: message.toString()
            });

            embed.setColor(await client.db.get(`${interaction.guild.id}.GUILD.GUILD_CONFIG.embed_color`) || '#21744c');
            embed.setTitle(data.suggest_acceptembed_title_to_put
                .replace('${msg.embeds[0].data?.title}', msg.embeds[0].data?.title));

            await msg.edit({ embeds: [embed] });
            await client.db.set(`${interaction.guild.id}.SUGGESTION.${id}.replied`, true);

            await interaction.deleteReply();
            await interaction.followUp({
                content: data.suggest_accept_command_work
                    .replace('${interaction.guild.id}', interaction.guild.id)
                    .replace('${interaction.channel.id}', interaction.channel.id)
                    .replace('${fetchId?.msgId}', fetchId?.msgId),
                ephemeral: true
            });
            return;
        }).catch(async (err: any) => {
            await interaction.deleteReply();
            await interaction.followUp({ content: data.suggest_accept_command_error, ephemeral: true });
            return;
        });
    },
};