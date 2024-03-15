#!/usr/bin/env node
const OpenAI = require('openai');
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

    
    const openai = new OpenAI({
        apiKey: apiKey,
    });
    
    const retryLimit = 5;

    let retryCount = 0;

    rl.question(`Please describe the task you'd like to perform: `, async (task) => {
    while (retryCount <= retryLimit) {
        try {
            // openai text completion function
            const completion = await openai.completions.create({
                prompt: `How do I ${task} in MacOS terminal? Please provide concise instruction with an example.`,
                temperature: 0.5,
                model: "gpt-3.5-turbo-instruct",
                max_tokens: 150,
            });

            completionOutput = completion.choices.pop();

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