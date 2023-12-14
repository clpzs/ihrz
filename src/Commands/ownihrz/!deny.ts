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
} from 'discord.js';

import config from '../../files/config';
import axios from 'axios';

export = {
    run: async (client: Client, interaction: any, data: any) => {

        let id_1 = interaction.options.getString('id');

        let id_2 = await client.db.get(`OWNIHRZ.TEMP.${interaction.user.id}.${id_1}`);

        for (let i in id_2) {
            for (let j in id_2[i]) {
                if (id_1 === j) {
                    id_2 = id_2?.[i]?.[j];
                }
            }
        };

        if ((interaction.user.id !== config.owner.ownerid1) && (interaction.user.id !== config.owner.ownerid2)) {
            await interaction.deleteReply();
            await interaction.followUp({ content: "❌", ephemeral: true });
            return;
        };

        if (!id_2) {
            await interaction.reply({ content: data.mybot_instance_deny_not_foud });
            return;
        };

        id_2.admin_key = config.api.apiToken;
        id_2.code = id_1;

        let config_2 = {
            headers: {
                Authorization: `Bot ${id_2.auth}`
            }
        };

        let bot_1 = (await axios.get(`https://discord.com/api/v10/applications/@me`, config_2)
            .catch((e: any) => { }))?.data || 404;

        if (bot_1 === 404) {
            await interaction.reply({ content: data.mybot_instance_deny_token_error });
            return;
        } else {
            let utils_msg = data.mybot_instance_deny_utils_msg
                .replace('${bot_1.bot.id}', bot_1.bot.id)
                .replace('${bot_1.bot.username}', bot_1.bot.username)
                .replace("${bot_1.bot_public ? 'Yes' : 'No'}",
                    bot_1.bot_public ? data.mybot_instance_deny_utils_msg_yes : data.mybot_instance_deny_utils_msg_no
                )
            let embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle(data.mybot_instance_deny_embed_title
                    .replace('${bot_1.bot.username}', bot_1.bot.username)
                    .replace('${bot_1.bot.discriminator}', bot_1.bot.discriminator)
                )
                .setDescription(data.mybot_instance_deny_embed_desc
                    .replace('${utils_msg}', utils_msg)
                )
                .setFooter({ text: 'iHorizon', iconURL: client.user?.displayAvatarURL() });

            await interaction.reply({ embeds: [embed], ephemeral: false });

            await client.db.delete(`OWNIHRZ.TEMP.${interaction.user.id}`);
            return;
        };
    },
};