const axios = require('axios');

async function sendMessageAPI(routine){

    axios({
        method: 'post',
        url: 'http://localhost:8080/api/sendMessage', // Replace with your actual API endpoint
        data: postData,
        auth: {
          username: process.env.BASIC_AUTH_USERNAME,
          password: process.env.BASIC_AUTH_PASSWORD,
        },
      })
        .then((response) => {
            return response;
        //   console.log('Response:', response.data);
        })
        .catch((error) => {
          console.error('Error:', error);
          throw 'Error in calling sending message API: ' + error
        });
}
module.exports = { sendMessageAPI };