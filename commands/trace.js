const {
	SlashCommandBuilder,
	EmbedBuilder
} = require('discord.js');

/*
notes to self: slash command names HAVE to be lowercase
*/

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trace')
		.setDescription('Identifies sauce with valid image or url attachment')
		.addAttachmentOption(Option =>
			Option.setName('image')
			.setDescription('Use an image to search')
			.setRequired(true)
		),

// use the api given from  trace.moe 
	async execute(interaction) {
		const attachment = interaction.options.getAttachment('image');
		const imageURL = attachment.url;

		await interaction.deferReply();

		const data = await fetch(
			`https://api.trace.moe/search?url=${encodeURIComponent(imageURL)}`,
		).then((e) => e.json());

		if (!data.result || data.result.length === 0) {
			return interaction.reply("No anime was found..");
		}

		const result = data.result[0]

		const anilistQuery = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
      }
      siteUrl
    }
  }
`;

		const variables = {
			id: result.anilist
		};

		const anilistResponse = await fetch('https://graphql.anilist.co', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				query: anilistQuery,
				variables
			})
		});

		const anilistData = await anilistResponse.json();
		const animeInfo = anilistData.data.Media;

		const animeTitle = animeInfo.title?.romaji || animeInfo.title?.english || "Unknown title..";
		const episode = result.episode;

		const timeFormat = (seconds) => {
			const mins = Math.floor(seconds / 60);
			const secs = Math.floor(seconds % 60);
			return `${mins}:${secs.toString().padStart(2, '0')}`;
		}
		
		const startTime = timeFormat(result.from);
		const endTime = timeFormat(result.to);

		const embed = new EmbedBuilder()
			.setColor(0x48CAE4)
			.setTitle(animeTitle)
			.setURL(animeInfo.siteUrl)
			.setDescription(`Episode: ${(episode)}\n Timestamp: ${startTime} - ${endTime}`)
			.setImage(animeInfo.coverImage.large)
			.setFooter({
				text: "Created using trace.moe and anilist API"
			})

		await interaction.editReply({embeds: [embed]})
	}
}