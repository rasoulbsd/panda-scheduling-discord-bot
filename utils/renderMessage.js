const ephemeralWarning = async (
	interaction,
	message,
) => {
	await interaction.deleteReply();
	await interaction.followUp({
		content: message,
		ephemeral: true,
	});
};

module.exports = { ephemeralWarning };