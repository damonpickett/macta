const { Configuration, OpenAIApi } = require("openai");
const readline = require ('readline');
const fs = require('fs');
const path = require("path");
const crypto = require("crypto");

require('dotenv').config();

const configFilePath = path.join(process.env.HOME, ".env");

let apiKey;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Check for/read .env file

if (!fs.existsSync(configFilePath)) {
    console.log('.env file not found, creating one now...');
    fs.writeFileSync(configFilePath, "OPENAI_API_KEY=");
    rl.question('Please enter your OpenAI API key: ', (key) => {
      apiKey = key;
      const encryptedKey = encrypt(apiKey);
      fs.writeFileSync(configFilePath, `OPENAI_API_KEY=${encryptedKey}`);
      apiCall();
    });
  } else {
    apiKey = decrypt(process.env.OPENAI_API_KEY);
    apiCall();
  }

function encrypt(text) {
    const cipher = crypto.createCipher("aes-256-cbc", process.env.ENCRYPTION_KEY);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipher("aes-256-cbc", process.env.ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
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

            }
        }
    }
    rl.close();
});
}
