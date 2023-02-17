#!/usr/bin/env node
const { Configuration, OpenAIApi } = require('openai');
const readline = require ('readline');
const fs = require('fs');
const path = require("path");
const os = require('os');

const configFilePath = path.join(__dirname, "config.json");




let apiKey;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Check for/read config file

try {
    // Try to read the config file
    apiKey = JSON.parse(fs.readFileSync(configFilePath)).apiKey;
    if (apiKey === undefined || apiKey.length === 0) {
      rl.question('Please enter your OpenAI API key: ', (key) => {
        apiKey = key;
        fs.writeFileSync(configFilePath, JSON.stringify({ apiKey }));
        apiCall();
      });
    } else {
      apiCall();
    }
  } catch (err) {
    console.log('config.json not found, creating one now...');
    fs.writeFileSync(configFilePath, JSON.stringify({ apiKey: '' }));
    rl.question('Please enter your OpenAI API key: ', (key) => {
      apiKey = key;
      fs.writeFileSync(configFilePath, JSON.stringify({ apiKey }));
      apiCall();
    });
  }



function apiCall() {

    const configuration = new Configuration({
        apiKey: apiKey,
    });
    
    const openai = new OpenAIApi(configuration);
    
    const retryLimit = 5;

    let retryCount = 0;

    rl.question(`Please describe the task you'd like to perform: `, async (task) => {
    while (retryCount <= retryLimit) {
        try {
            // openai text completion function
            const completion = await openai.createCompletion({
                prompt: `How do I ${task} in MacOS terminal? Please provide instruction with an example.`,
                temperature: 0.5,
                model: "text-davinci-003",
                max_tokens: 250,
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
}