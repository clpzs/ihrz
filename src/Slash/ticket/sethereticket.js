const {
	Client,
	Intents,
	Collection,
	ChannelType,
	EmbedBuilder,
	Permissions,
	ApplicationCommandType,
	PermissionFlagsBits,
	PermissionsBitField,
	ApplicationCommandOptionType
} = require('discord.js');

module.exports = {
	name: 'sethereticket',
	description: 'Open a ticket if the ticket module is enable on the guild',
	options: [
		{
			name: "name",
			description: "The name of you ticket's panel.",
			type: ApplicationCommandOptionType.String,
			required: true,
		}
	],
	run: async (client, interaction) => {
		const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
		let data = await getLanguageData(interaction.guild.id);

		let panelName = interaction.options.getString("name")

		const { QuickDB } = require("quick.db");
		const db = new QuickDB();
		let blockQ = await db.get(`${interaction.user.id}.GUILD.TICKET.on_or_off`)
		if (blockQ === true) {
			return interaction.reply(data.sethereticket_disabled_command);
		}

		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
			return interaction.reply(data.sethereticket_not_admin);

		let panel = new EmbedBuilder()
			.setTitle(`${panelName}`)
			.setColor("#3b8f41")
			.setDescription(data.sethereticket_description_embed)
			.setFooter({ text: 'iHorizon', iconURL: client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) })

		interaction.channel.send({ embeds: [panel] }).then(async message => {
			message.react("📩")
			await db.set(`${message.guild.id}.GUILD.TICKET.${message.id}`,
				{
					author: interaction.user.id,
					used: true,
					panelName: panelName,
					channel: message.channel.id,
					messageID: message.id,
				})
		})

		interaction.reply({ content: data.sethereticket_command_work, ephemeral: true })

		const filter = (interaction) => interaction.user.id === interaction.member.id;
	}
}