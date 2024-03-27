const axios = require('axios');

async function sendMessageAPI(postData) {
	return (await axios({
		method: 'post',
		url: `${process.env.PROD_ADDRESS}/api/sendMessage`,
		data: postData,
		auth: {
			username: process.env.BASIC_AUTH_USERNAME,
			password: process.env.BASIC_AUTH_PASSWORD,
		},
	}));
}
module.exports = { sendMessageAPI };