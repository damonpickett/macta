const { Configuration, OpenAIApi } = require("openai");
const readline = require ('readline');
const fs = require('fs');
const axios = require('axios');

let apiKey;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Check for/read config file
try {
    // Try to read the config file
    apiKey = JSON.parse(fs.readFileSync('config.json')).apiKey;
} catch (err) {
    // If the file doesn't exist or is invalid, prompt the user for the API key
    readline.question('Please enter your OpenAI API key: ', (key) => {
        apiKey = key;
        fs.writeFileSync('config.json', JSON.stringify({ apiKey }));
        readline.close();
    });
}

// Check if API key is a valid OpenAI API key by making an API call with it
const checkApiKey = async (apiKey) => {
    try {
        const response = await axios.get('https://api.openai.com/v1/engines', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
        });
        return true;
    } catch (err) {
        if (err.response.status === 401) {
            console.log('Invalid API key');
            return false;
        } else {
            console.log(`An error occurred: ${err}`);
            return false;
        }
    }
};

if (!apiKey || !(checkApiKey(apiKey))) {
    // If no key was found or the key is invalid, prompt the user to enter a new one
    rl.question('Please enter your OpenAI API key: ', (key) => {
        apiKey = key;
        fs.writeFileSync('config.json', JSON.stringify({ apiKey }));
        rl.close();
    });
}


const configuration = new Configuration({
    apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

const retryLimit = 5;
let retryCount = 0;




rl.question(`Please describe the task you'd like to perform: `, async (task) => {
    while (retryCount <= retryLimit) {
        try {
            // openai text completion function goes here
            const completion = await openai.createCompletion({
                prompt: `How do I ${task} in MacOS terminal? Please provide instruction with an example.`,
                temperature: 0.5,
                model: "text-davinci-002",
                max_tokens: 250,
                temperature: 0.5
            });

            completionOutput = completion.data.choices.pop();

            const text = completionOutput.text;

            console.log(text);
            break;
        } catch (err) {
            if(err.message == "503"){
                err.statusCode = 503;
                console.log(`503 error occurred, retry: ${retryCount} of ${retryLimit}`);
                retryCount++;
                continue;
            } else {
                console.log(`An error occurred: ${err}`);
                break;
            }
        }
    }
    rl.close();
});