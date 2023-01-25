const { Configuration, OpenAIApi } = require("openai");
const readline = require ('readline');
const fs = require('fs');
const axios = require('axios');

let apiKey;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});







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