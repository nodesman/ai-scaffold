#!/usr/bin/env node
import ora from "ora";
import { Configuration, OpenAIApi } from "openai";
import fs from 'fs';
import path from 'path';

const apiKey = process.env.SCAFFOLD_APIKEY;

if (!apiKey) {
    console.log('No SCAFFOLD_APIKEY environment variable set');
    process.exit(1);
} else {
    console.log('SCAFFOLD_APIKEY is set');
}
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


function processResponse(response, targetDirectory, DEBUG) {
    // Ensure targetDirectory is correctly formatted
    targetDirectory = path.resolve(targetDirectory);

    response.files_and_directories.forEach(item => {
        let fullPath = path.join(targetDirectory, item.name);

        if (item.type === 'file') {
            // Check if the directory exists before writing the file
            const directoryPath = path.dirname(fullPath);
            if (!fs.existsSync(directoryPath)) {
                try {
                    fs.mkdirSync(directoryPath, { recursive: true });
                } catch (err) {
                    console.error(`Error creating directory ${directoryPath}`, err);
                }
            }

            try {
                fs.writeFileSync(fullPath, item.content);
                console.log(`File ${fullPath} was written successfully.`);
            } catch (err) {
                console.error(`Error writing file ${fullPath}`, err);
            }
        } else if (item.type === 'directory') {
            // Check if the directory exists before creating the directory
            if (!fs.existsSync(fullPath)) {
                try {
                    fs.mkdirSync(fullPath, { recursive: true });
                    console.log(`Directory ${fullPath} was created successfully.`);
                } catch (err) {
                    console.error(`Error creating directory ${fullPath}`, err);
                }
            }
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
        try {
            fs.accessSync(filePath, fs.constants.R_OK);
            console.log(`${fileName} exists and is readable in the current directory.`);
            // Add logic here to process the file if it exists and is readable
        } catch (err) {
            console.log(`The file ${fileName} is not readable.`);
            console.log('Please check the file permissions and try again.');
            process.exit(1);
        }
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
    
    After you are done coming up with the entire code base, give me the content of the entire project as files but instead of putting the entire code in the paths, put a prompt in that file's content that will when given to GPT-4 will give me the intended file content. 
    In order to facilitate the proper development of files via the GPT-4 AI, please ensure you provide all necessary context within the prompt. This context should sufficiently direct the AI to generate the appropriate file content. The prompt must be inclusive of all specific details such as identifier names, path names, and file names as required. This is to ensure that when these files are brought together, they seamlessly integrate and make logical sense as a whole.

    It's important to focus solely on the file's content in the prompt text for each file. You need not worry about defining the broader context or file location. I am writing a script to correctly place the output from GPT-4 into the respective file. Please provide a prompt that, given the project description and the corresponding content for this file, will generate the necessary output.
    
    Take into account the length of each prompt file you create. The prompt can be up to 8192 tokens long, so feel free to be as verbose as needed in order to create specific, detailed prompts.
    
    Carrying over and specifying identifier names from one file to another is essential. For instance, if you specify in your Sass file prompt that the navigation element will have a class named 'main-nav', ensure that this is also reflected in the layout prompt.
    
    Try to avoid making abstract statements in these file prompts. For example, avoid statements like 'links to privacy policy and terms of service (if any), and possibly social media links'. In your prompts, assume a definitive structure and stick to creating content based on that. All content should be considered mandatory unless otherwise stated.
    
    When outlining these specifications, ensure you provide clear details such as the label of the link, and offer a detailed description of the Document Object Model (DOM), with the exception of the username.
    
    If providing this level of specificity would help in generating a more accurate outcome, then respond with a single file named 'questions.txt' containing a series of questions. I can provide the answers in my next prompt, which would subsequently allow you to generate clearer prompts leading to a fully runnable piece of code.
    
     
    Include a readme file if you can.
    
    
    `;
    var spinner= ora("Asking GPT-4 to do the thing ...").start();
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
    spinner.stop();
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