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

const { Client,
	Intents,
	EmbedBuilder,
	ApplicationCommandType,
	ApplicationCommandOptionType,
	Permissions,
	PermissionsBitField
} = require(`${process.cwd()}/files/ihorizonjs`);

const logger = require(`${process.cwd()}/src/core/logger`);

slashInfo.moderation.unlock.run = async (client, interaction) => {
	const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
	let data = await getLanguageData(interaction.guild.id);

	const permission = interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels);
	if (!permission) return interaction.reply({ content: data.unlock_dont_have_permission });
	const embed = new EmbedBuilder()
		.setColor("#5b3475")
		.setTimestamp()
		.setDescription(data.unlock_embed_message_description);
	interaction.channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true });


	try {
		logEmbed = new EmbedBuilder()
			.setColor("#bf0bb9")
			.setTitle(data.unlock_logs_embed_title)
			.setDescription(data.unlock_logs_embed_description
				.replace(/\${interaction\.user\.id}/g, interaction.user.id)
				.replace(/\${interaction\.channel\.id}/g, interaction.channel.id)
			)
		let logchannel = interaction.guild.channels.cache.find(channel => channel.name === 'ihorizon-logs');
		if (logchannel) { logchannel.send({ embeds: [logEmbed] }) }
	} catch (e) { logger.err(e) };

	return interaction.reply({ embeds: [embed] });
};

module.exports = slashInfo.moderation.unlock;