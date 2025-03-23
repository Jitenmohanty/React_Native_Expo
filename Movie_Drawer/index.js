const https = require('https');

const movieId = 'tt0111161'; // Example: The Shawshank Redemption (Replace with actual ID)
const apiKey = process.env.RAPIDAPI_KEY || 'your_api_key_here'; // Use environment variable

const options = {
    method: 'GET',
    hostname: 'moviesdatabase.p.rapidapi.com',
    path: `/titles/${movieId}/main_actors`,
    headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsedData = JSON.parse(data);
            console.log(parsedData);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
});

req.on('error', (error) => {
    console.error('Request failed:', error);
});

req.end();
