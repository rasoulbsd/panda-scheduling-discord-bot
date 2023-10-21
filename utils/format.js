const getMsgLink = (
	guildId,
	channelId,
	msgID,
) => `https://discord.com/channels/${guildId}/${channelId}/${msgID}`;

module.exports = { getMsgLink };