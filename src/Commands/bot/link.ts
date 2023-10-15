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
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRow,
    ButtonInteraction
} from 'discord.js'

import { Command } from '../../../types/command';

export const command: Command = {
    name: 'links',
    description: 'Show all links about iHorizon',
    category: 'bot',
    run: async (client: Client, interaction: any) => {
        let data = await client.functions.getLanguageData(interaction.guild.id);

        const websitebutton = new ButtonBuilder()
            .setLabel(data.links_website)
            .setStyle(ButtonStyle.Link)
            .setURL('https://ihrz.github.io');

        const githubbutton = new ButtonBuilder()
            .setLabel(data.links.github)
            .setStyle(ButtonStyle.Link)
            .setURL('https://github.com/ihrz/ihrz')

        const testbutton = new ButtonBuilder()
            .setLabel('Michou')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('✨')
            .setCustomId('test_button')

            const row = new ActionRowBuilder().addComponents(websitebutton, githubbutton, testbutton);

            await interaction.editReply({
                content: data.links_message,
                components: [row],
            });
    
            client.on('interactionCreate', async (interaction) => {
                if (!interaction.isButton()) return;
    
                if (interaction.customId === 'test_button') {
                    await interaction.user.send('Salut c\'est Michou');
                }
            });
        },
    };