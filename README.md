# ai-scaffold

The `ai-scaffold` is a command-line tool that uses GPT-4 to generate files and directories based on a provided prompt. It allows you to quickly scaffold a instantly runnable project with some pre-written by GPT-4 using a text prompt. The extent of code generation is currently limited only by the response token limit from OpenAI but with the modest token limits small software projects can be generated based on a prompt. 

The prompt itself can be as long as 8192 tokens. [Click here](https://platform.openai.com/tokenizer) to test if your prompt is within those limits.  

## Installation

To install the `ai-scaffold` package, you can use npm:

```bash
npm install -g ai-scaffold
```

## Setup

Before using the `ai-scaffold` CLI, you need to set up your OpenAI API key as an environment variable. This key is required to communicate with GPT-4. If you don't have an API key yet, follow these steps to enable GPT-4 in your OpenAI account:

1. **OpenAI Account:** If you don't already have one, sign up for an account on the OpenAI website: [https://beta.openai.com/signup/](https://beta.openai.com/signup/).

2. **Access GPT-4:** You need to have made a successful payment on your OpenAI's platform account. Not a premium subscription to chat.openai.com. You must have accumulated enough usage on your https://platform.openai.com/ account. How you do it? I guess use your provided API key sufficiently to rack up some usage. You have to wait until the next billing cycle to be charged, and then a few more days for some automated or manual process to grant access to your account. You will receive an email at your registered platform.openai.com account intimating you that your account has been granted access to GPT-4.  

3. **Retrieve API Key:** Once you have access to GPT-4, log in to your OpenAI platform account (https://platform.openai.com/) and click on "View API Keys" on the top right User menu. Retrieve your API key from the dashboard.

4. **Set Environment Variable:** To set your API key as an environment variable, open your terminal or command prompt and execute the following command (replace "YOUR_API_KEY" with your actual API key):

   **On Windows:**
    ```bash
    set SCAFFOLD_APIKEY=YOUR_API_KEY
    ```

   **On macOS and Linux:**
    ```bash
    export SCAFFOLD_APIKEY=YOUR_API_KEY
    ```

   Alternatively, you can add the environment variable to your shell configuration file (e.g., `.bashrc`, `.bash_profile`, `.zshrc`, or `.profile`) to make it persist across terminal sessions.

## Usage

To use the `ai-scaffold` CLI, you need to create a file named `prompt.txt` in your current working directory. The CLI will use the content of this file as the prompt for GPT-4. Additionally, you can include specific instructions or requirements for file and directory generation in the `prompt.txt` file.

For example, your `prompt.txt` file could look like this:

```plaintext
Create a simple web application.
- Generate an index.html file with basic HTML structure.
- Add a styles.css file for CSS styles.
- Create a main.js file for JavaScript logic.
```

After creating the `prompt.txt` file and setting up the OpenAI API key, you can run the `ai-scaffold` CLI by executing the following command in your terminal:

```bash
scaffold
```

The CLI will then invoke GPT-4 using OpenAI's API to process your prompt and generate the required files and directories. The generated files will be placed in a directory named "builds" by default, but you can specify a different target directory using the `-t` flag.

### Example with Target Directory

To specify a custom target directory for the generated files, use the `-t` flag followed by the desired directory name:

```bash
scaffold -t my-app
```

This command will create a directory named "my-app" (if it doesn't exist) and place the generated files inside it.

## Debugging

The `ai-scaffold` CLI supports debugging by using the `SCAFFOLD_DEBUG` environment variable. If you want to enable debugging mode to log the received response from GPT-4, you can set the `SCAFFOLD_DEBUG` variable to "true" before running the CLI:

```bash
export SCAFFOLD_DEBUG=true
scaffold
```

In debugging mode, the CLI will log the GPT-4 response to a file named `.responses.json` in the current working directory.

## Important Notes

- The `ai-scaffold` CLI requires an OpenAI API key to communicate with GPT-4. Ensure that you have set the `SCAFFOLD_APIKEY` environment variable with your valid API key before running the CLI.

- The CLI uses the GPT-4 model "gpt-4-0613" by default. If you want to use a different GPT-4 model, you can modify the `model` parameter in the CLI code.

- The `ai-scaffold` package uses the `axios`, `openai`, and `ora` dependencies. These dependencies will be automatically installed when you install the `ai-scaffold` package using npm.

## License

Copyright 2023 Rajasekharan Sundararaj (github.com/nodesman/)

<strong>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use the Software for personal use or within their organization</strong>, subject to the following conditions:

1. The Software may not be redistributed, sublicensed, or made available to third parties without express written permission from the copyright holder.

2. The Software may not be modified, adapted, or built upon without express written permission from the copyright holder.

3. Any redistribution, sublicensing, or use of the Software in violation of these terms will be considered a breach of copyright and may be subject to legal action.

THE SOFTWARE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
