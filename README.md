# MACTA
Macintosh Terminal Assistant.

## Table of Contents
- [Project Title](#project-title)
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)
- [Appendix](#appendix)
- [Formatting and Best Practices](#formatting-and-best-practices)

## Description
MacTA is command-line application that utilizes the OpenAI API to generate instructions for performing tasks in the MacOS terminal. The application prompts the user to enter a task description, then uses the OpenAI text completion function to generate a set of instructions based on the provided task description. The generated instructions are printed to the console for the user to view. The application also includes functionality for reading and writing an API key to a local config file, and handles API request errors with retry attempts.

The purpose of this application is to assist users with performing tasks in the MacOS terminal by generating clear and concise instructions without having to leave the terminal. This can be particularly helpful for individuals who are new to the terminal or unfamiliar with specific terminal commands.

## Installation
1. Install Node.js on your system. You can download Node.js from the official website: [Node.js](https://nodejs.org/)
2. Install MacTA globally by running the following command in your terminal: `npm install -g macta`
3. Obtain an API key for the OpenAI API from the [OpenAI website](https://beta.openai.com/signup/)
4. Run MacTA by entering the following command in your terminal: `macta`

You should now be prompted to enter a task description. MacTA will generate instructions based on your input. 

## Usage
1. Open your terminal and type `macta` from within any directory in your terminal.
2. You will be prompted to enter a description of the task you'd like to perform. For best results, simply answer the question “How do I…?” E.G. `delete a file`.
3. MacTA will generate a set of instructions based on your task description. The instructions will include a command-line example for the task, as well as any additional details that might be helpful.
4. If you'd like to perform another task, simply run the `macta` command again and repeat the process.

## Contributing
If you encounter a bug while using macta or would like to request a new feature, please submit an issue on the macta GitHub repository. To submit an issue, follow these steps:

1. Click the "Issues" tab at the top of the page.
2. Click the "New issue" button.
3. Fill out the template with as much detail as possible, including steps to reproduce the bug or a clear description of the new feature you're requesting.
4. Click the "Submit new issue" button.

Once you've submitted an issue, I will review it and respond as soon as possible.

## License
ISC