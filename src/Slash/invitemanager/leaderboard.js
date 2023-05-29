const fs = require("fs");
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
} = require('discord.js');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: 'leaderboard',
  description: 'Show the guild invites\'s leaderboard',
  run: async (client, interaction) => {
    const getLanguageData = require(`${process.cwd()}/src/lang/getLanguageData`);
    let data = await getLanguageData(interaction.guild.id);

    var text = data.leaderboard_default_text;
    const ownerList = await db.all();
    const foundArray = ownerList.findIndex(ownerList => ownerList.id === interaction.guild.id)
    const char = ownerList[foundArray].value.USER;

    for (var i in char) {
      var a = await db.get(`${interaction.guild.id}.USER.${i}.INVITES.DATA`)
      if (a) {
        text += data.leaderboard_text_inline
        .replace(/\${i}/g, i)
        .replace(/\${a\.invites\s*\|\|\s*0}/g, a.invites||0)
        .replace(/\${a\.regular\s*\|\|\s*0}/g, a.regular||0)
        .replace(/\${a\.bonus\s*\|\|\s*0}/g, a.bonus||0)
        .replace(/\${a\.leaves\s*\|\|\s*0}/g, a.leaves||0)
      };
    };

    const embed = new EmbedBuilder().setColor("#FFB6C1").setDescription(`${text}`).setTimestamp()

    return interaction.reply({ embeds: [embed] });
  }
};
