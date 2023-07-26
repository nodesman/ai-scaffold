#!/usr/bin/env node

const apiKey = "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";
const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);
var schema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "files_and_directories": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "description": "The type of file to create. Valid values are: file, directory, symlink"
                    },
                    "name": {
                        "type": "string",
                        "description": "The name of the file to create"
                    },
                    "content": {
                        "type": "string",
                        "description": "The content of the file to create"
                    }
                },
                "required": [
                    "type",
                    "name"
                ]
            }
        }
    },
    "required": [
        "files_and_directories"
    ]
};
const fs = require('fs');
const path = require('path');

function processResponse(response, targetDirectory, DEBUG) {
    // Ensure targetDirectory is correctly formatted
    targetDirectory = path.resolve(targetDirectory);

    response.files_and_directories.forEach(item => {
        let fullPath = path.join(targetDirectory, item.name);

        if (item.type === 'file') {
            fs.writeFile(fullPath, item.content, (err) => {
                if (err) {
                    console.error(`Error writing file ${fullPath}`, err);
                } else {
                    console.log(`File ${fullPath} was written successfully.`);
                }
            });
        } else if (item.type === 'directory') {
            fs.mkdirSync(fullPath, {recursive: true}, (err) => {
                if (err) {
                    console.error(`Error creating directory ${fullPath}`, err);
                } else {
                    console.log(`Directory ${fullPath} was created successfully.`);
                }
            });
        }
    });
}

let FILENAME = "prompt.txt";

function checkForPromptFile() {
    // Define the expected file
    const fileName = FILENAME;

    // Generate the full path
    const filePath = path.join(process.cwd(), fileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        console.log(`Expected a file named ${fileName} in the current directory.`);
        console.log('Please create the file and try again.');
        process.exit(1);
    } else {
        // Check if the file is readable
        fs.access(filePath, fs.constants.R_OK, (err) => {
            if (err) {
                console.log(`The file ${fileName} is not readable.`);
                console.log('Please check the file permissions and try again.');
                process.exit(1);
            } else {
                console.log(`${fileName} exists and is readable in the current directory.`);
                // Add logic here to process the file if it exists and is readable
            }
        });
    }
}

function checkAndCreateTargetDirectory() {
    let args = process.argv.slice(2); // Get CLI arguments, exclude 'node' and script path
    let targetDirectory = 'builds'; // Default target directory

    // Check if "-t" flag is used
    let tIndex = args.indexOf('-t');
    if (tIndex > -1 && tIndex < args.length - 1) {
        targetDirectory = args[tIndex + 1];
    }

    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true }); // { recursive: true } allows nested directories
        console.log(`Created target directory: ${targetDirectory}`);
    } else {
        console.log(`Target directory already exists: ${targetDirectory}`);
    }

    return targetDirectory; // Return the target directory
}


(async function () {

    var DEBUG = false;
    if (process.env.SCAFFOLD_DEBUG === 'true') {
        console.log('The SCAFFOLD_DEBUG environment variable is set to true');
        console.log('Logging received response to .responses.json');
        DEBUG = true;
    } else {
        console.log('The SCAFFOLD_DEBUG environment variable is not set to true');
    }

    checkForPromptFile();
    const targetDirectory = checkAndCreateTargetDirectory();

    let prompt = fs.readFileSync(FILENAME, 'utf8');
    prompt += `
    Be sure to include a build file if it makes sense in this context that will be necessary for any development tasks. 
    Be sure to include a README.md with instructions to build and run the project and build it for distribution. Also include instructions to install dependencies.
    `;
    const response = await openai.createChatCompletion({
        model: "gpt-4-0613",
        messages: [
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature: 1,
        functions: [{"name": "get_files_of_scaffold", "parameters": schema}],
        function_call: {"name": "get_files_of_scaffold"},
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    let responseText = response.data.choices[0].message.function_call.arguments.replace(/\n/g, '');
    if (DEBUG) {
        let LOG_FILE_NAME = '.responses.json';
        let now = new Date();
        let timestamp = now.toISOString();
        let data = `------------\nTimestamp: ${timestamp}\n------------\n`;
        fs.appendFileSync(LOG_FILE_NAME, data, 'utf8');
        fs.appendFileSync(LOG_FILE_NAME, responseText, 'utf8');
        fs.appendFileSync(LOG_FILE_NAME, responseText, 'utf8');
    }
    let response1 = JSON.parse(responseText);
    processResponse(response1, targetDirectory, DEBUG);
})();