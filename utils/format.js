const getMsgLink = (
	guildId,
	channelId,
	msgID,
) => `https://discord.com/channels/${guildId}/${channelId}/${msgID}`;

function serializeObject(obj) {
	const stack = [obj];
	const result = {};

	while (stack.length > 0) {
		const currentObj = stack.pop();

		for (const key in currentObj) {
			if (typeof currentObj[key] === 'bigint') {
				result[key] = currentObj[key].toString();
			}
			else if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
				stack.push(currentObj[key]);
			}
			else {
				result[key] = currentObj[key];
			}
		}
	}

	return result;
}

const monthNames = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];


module.exports = { getMsgLink, serializeObject, monthNames };