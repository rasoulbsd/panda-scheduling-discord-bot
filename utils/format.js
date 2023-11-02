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
			// Convert BigInt to string
				result[key] = currentObj[key].toString();
			}
			else if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
			// If the property is an object, push it onto the stack
				stack.push(currentObj[key]);
			}
			else {
			// Copy other types as-is
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