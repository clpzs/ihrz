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
    Client,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    ApplicationCommandType,
} from 'discord.js';

import { Command } from '../../../../types/command';

export const command: Command = {
    name: "rpg",

    description: "Subcommand for the RPG category!",
    description_localizations: {
        "fr": "Commande sous-groupé pour la catégorie du RPG"
    },

    options: [
        {
            name: "start",
            name_localizations: {
                "fr": "commencer"
            },

            description: "Start your RPG adventure!",
            description_localizations: {
                "fr": "Commencez votre aventure sur le RPG!"
            },

            type: 1,
            options: [
                {
                    name: 'language',
                    type: ApplicationCommandOptionType.String,

                    description: 'What is the language of your adventure? (you can change it later)',
                    description_localizations: {
                        "fr": "Quel language voulez-vous prendre pour votre aventure (changeable plus tard)"
                    },

                    required: true,
                    choices: [
                        {
                            name: 'Français',
                            value: "fr"
                        },
                        {
                            name: "English",
                            value: "en"
                        },
                    ],
                },
            ],
        }
    ],
    thinking: false,
    category: 'RPG',
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        let command = interaction.options.getSubcommand();
        const commandModule = await import(`./!${command}.js`);
        await commandModule.default.run(client, interaction);
    },
};