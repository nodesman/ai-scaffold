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

function processResponse(response, targetDirectory) {
    // Ensure targetDirectory is correctly formatted
    targetDirectory = path.resolve(targetDirectory);

    response.files_and_directories.forEach(item => {
        let fullPath = path.join(targetDirectory, item.name);

        if(item.type === 'file') {
            fs.writeFile(fullPath, item.content, (err) => {
                if(err) {
                    console.error(`Error writing file ${fullPath}`, err);
                } else {
                    console.log(`File ${fullPath} was written successfully.`);
                }
            });
        } else if(item.type === 'directory') {
            fs.mkdirSync(fullPath, { recursive: true }, (err) => {
                if (err) {
                    console.error(`Error creating directory ${fullPath}`, err);
                } else {
                    console.log(`Directory ${fullPath} was created successfully.`);
                }
            });
        }
    });
}


(async function () {
    const response = await openai.createChatCompletion({
        model: "gpt-4-0613",
        messages: [
            {
                "role": "user",
                "content": "Please give me the scaffold of a project - all the files and their content for a chrome extension that will allow me to add a div element to the top right of every web page that says WORKS!!"
            }
        ],
        temperature: 1,
        max_tokens: 256,
        functions: [{"name": "get_files_of_scaffold", "parameters": schema}],
        function_call: {"name": "get_files_of_scaffold"},
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    let response1 = JSON.parse(response.data.choices[0].message.function_call.arguments);
    processResponse(response1,"./builds/");
})();
