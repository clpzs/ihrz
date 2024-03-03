/*
・ iHorizon Discord Bot (https://github.com/ihrz/ihrz)

・ Licensed under the Attribution-NonCommercial-ShareAlike 2.0 Generic (CC BY-NC-SA 2.0)

    ・   Under the following terms:

        ・ Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

        ・ NonCommercial — You may not use the material for commercial purposes.

        ・ ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

        ・ No additional restrictions — You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.


・ Mainly developed by Kisakay (https://github.com/Kisakay)

・ Copyright © 2020-2024 iHorizon
*/

import {
    BaseGuildTextChannel,
    ChatInputCommandInteraction,
    Client,
    EmbedBuilder,
    PermissionsBitField,
} from 'discord.js';

import logger from '../../../core/logger.js';
import { LanguageData } from '../../../../types/languageData';
import LanguageDat from '../../../../RPG/LANG/Manager.js';

export default {
    run: async (client: Client, interaction: ChatInputCommandInteraction, data: LanguageData) => {
        await client.RPG.Profile.Start(interaction.user.id, interaction.options.getString("language"));
        data = LanguageDat(interaction.user.id, client);
        let embed = new EmbedBuilder()
            .setTitle(data.StartTitle)
            .setDescription(data.StartDescription)
            .setColor("#90ee90");
        await interaction.reply({
            embeds: [embed]
        });
    },
};