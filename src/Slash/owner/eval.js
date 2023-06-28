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
    ChannelType,
    EmbedBuilder,
    Permissions,
    ApplicationCommandType,
    PermissionsBitField,
    ApplicationCommandOptionType
} = require(`${process.cwd()}/files/ihorizonjs`);

const logger = require(`${process.cwd()}/src/core/logger`);
const config = require(`${process.cwd()}/files/config`);

slashInfo.owner.eval.run = async (client, interaction) => {
    if (interaction.user.id !== config.owner.ownerid1
        || interaction.user.id !== config.owner.ownerid2) {
        return interaction.reply({ content: "❌", ephemeral: true });
    };

    var result = interaction.options.getString("code");
    try {
        eval(result);

        let embed = new EmbedBuilder()
            .setColor("#468468")
            .setTitle("This block was evalued with iHorizon.")
            .setDescription(`\`\`\`JS\n${result || "None"}\n\`\`\``)
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

        return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
        return interaction.reply({ content: err.toString(), ephemeral: true });
    };
};

module.exports = slashInfo.owner.eval;