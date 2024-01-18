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
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    PermissionsBitField
} from 'discord.js';
import { LanguageData } from '../../../../types/languageData';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction, data: LanguageData) => {

        let id = interaction.options.getString("id");

        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.editReply({ content: data.suggest_delete_not_delete });
            return;
        };

        let baseData = await client.db.get(`${interaction.guild?.id}.SUGGEST`);
        let fetchId = await client.db.get(`${interaction.guild?.id}.SUGGESTION.${id}`);

        if (!baseData
            || baseData?.channel !== interaction.channel?.id
            || baseData?.disable === true) {
            await interaction.deleteReply();
            await interaction.followUp({
                content: data.suggest_delete_not_good_channel
                    .replace('${baseData?.channel}', baseData?.channel),
                ephemeral: true
            });

            return;
        };

        if (!fetchId) {
            await interaction.deleteReply();
            await interaction.followUp({ content: data.suggest_delete_not_found_db, ephemeral: true });
            return;
        };

        let channel = interaction.guild?.channels.cache.get(baseData?.channel);

        await (channel as BaseGuildTextChannel).messages.fetch(fetchId?.msgId).then(async (msg) => {
            msg.delete();
            await client.db.delete(`${interaction.guild?.id}.SUGGESTION.${id}`);

            await interaction.deleteReply();
            await interaction.followUp({ content: data.suggest_delete_command_work, ephemeral: true });
            return;
        }).catch(async (err: any) => {
            await interaction.deleteReply();
            await interaction.followUp({ content: data.suggest_delete_command_error, ephemeral: true });
            return;
        });
    },
};