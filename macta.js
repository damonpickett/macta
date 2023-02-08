const { Configuration, OpenAIApi } = require("openai");
const readline = require ('readline');
const fs = require('fs');
const path = require("path");

require('dotenv').config();

const envPath = path.join(process.env.HOME, ".env");

let apiKey;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Check for/read config file
// If no config file, create one and...
// prompt user for their api key
// Make api function call
try {
    // Try to read the config file
    apiKey = fs.readFileSync(envPath).process.env.OPENAI_API_KEY;
    if (process.env.OPENAI_API_KEY === undefined || process.env.OPENAI_API_KEY.length === 0) {
      // Get the user to enter their api key and add it to the pre-existing .env file
      rl.question('Please enter your OpenAI API key: ', (key) => {
        apiKey = key;
        fs.writeFileSync(envPath, `OPENAI_API_KEY=${apiKey}`);
        apiCall();
      });
    } else {
        apiCall();
    }
  } catch (err) {
    // .env file not found so create one and add api key
    console.log(err)
    console.log('.env file not found, creating one now...');
    fs.writeFileSync(envPath, `OPENAI_API_KEY=`);
    rl.question('Please enter your OpenAI API key: ', (key) => {
      apiKey = key;
      fs.writeFileSync(envPath, `OPENAI_API_KEY=${apiKey}`);
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
                model: "text-davinci-002",
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