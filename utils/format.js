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

function getFriendlyRoutineName(routineOption) {
	switch (routineOption) {
	case 'monday-tuesday-wednesday-thursday-friday':
		return 'Everyday';
	case 'monday-wednesday-friday':
		return 'Even Days';
	case 'tuesday-thursday':
		return 'Odd Days';
	default:
		return 'Custom Routine';
	}
}

function buildThreadContent(context, role) {
	if (!context) {
		context = 'Please leave your updates in this thread,' +
						'\nPlease use the following template:' +
						'\n🙋‍♀️How I feel🙋‍♂️' +
						'\n-' +
						'\n-' +
						'\n👩‍💻What I\'m busy with🧑‍💻' +
						'\n-' +
						'\n-' +
						'\n🧱Blockers I\'m facing and suggestions to fix them🧱' +
						'\n-' +
						'\n-' +
						'\n🤓Final remark🤓' +
						'\n-' +
						'\n-';
	}
	let content = 'Hey Hey, ';
	content += role ? `<@&${role}>,\n` : '\n';
	content += context;
	return content;
}


module.exports = { getMsgLink, serializeObject, monthNames, getFriendlyRoutineName, buildThreadContent };