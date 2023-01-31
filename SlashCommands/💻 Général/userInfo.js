const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, GuildMember } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
            .setName('userinfo')
            .setDescription(`Avoir des informations sur vous ou un utilisateur 💁`)
            .addUserOption(option => option.setName('utilisateur').setDescription('Choisissez un utilisateur').setRequired(true)),
            /**
             * 
             * @param {*} interaction 
             */
        async execute(interaction, client) {
            const member = interaction.options.getMember('utilisateur');
            const user = interaction.options.getUser('utilisateur');
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            let rolemap = member.roles.cache.filter(r => r.name != "@everyone").sort((a, b) => b.position - a.position).map(r => r).join(" ");
            if (rolemap.length > 1024) rolemap = "`Cette utilisateur à trop de rôle pour les affichers !`";
            if (!rolemap) rolemap = "`Cette utilisateur n'a pas de rôle!`";
            let status = {
                online: 'En ligne',
                idle: 'Afk',
                dnd: 'Ne pas déranger',
                offline: 'Hors ligne/Invisible'
            };
            let status2 = {
                true: 'Bot',
                false: 'pas un bot'
            };
            const exampleEmbed = new EmbedBuilder()
                .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
                .setThumbnail(user.displayAvatarURL())
                .setColor(member.roles.highest.color)
                .addFields(
                    { name: '📛' + ' Pseudo', value: "`" + `${user.username}` + "`", inline: true },
                    { name: '🆔' + ' ID', value: "`" + `${user.id}` + "`", inline: true },
                    { name: '✍️' + ' Nick', value: "`" + `${member.nickname || "Pas de nick"}` + "`", inline: true },
                    { name: '🤖 ' + ' Bot', value: "`" + `${status2[user.bot]}` + "`", inline: true },
                    { name: '🛠️ ' + ' Compte créé', value: `<t:` + `${Math.floor(user.createdTimestamp/1000)}` + `:R>`, inline: true },
                    { name: '🚪 ' + ' Rejoins ', value: `<t:` + `${Math.floor(member.joinedTimestamp/1000)}` + `:R>`, inline: true },
                    { name: '🏓 ' + ' Status', value: "`" + `${status[member.presence.status]}` + "`", inline: true },
                    { name: '🙏 ' + ' Boost serveur depuis', value: "`" + `${member.premiumSince?.toLocaleDateString("en-US", options) || "ne boost pas"}` + "`", inline: true },
                    { name: '🎧 ' + ' Voice Channel', value: `${member.voice.channel || "`N'est pas dans un vocal actuellement`"}`, inline: true },
                    { name: '🏅 '+' Roles', value: rolemap, inline: true },
                )
	            .setTimestamp();

	        interaction.reply({ embeds: [exampleEmbed]});
	},
};