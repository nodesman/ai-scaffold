# Scaffold CLI

The Scaffold CLI is a command-line tool that uses GPT-4 to generate files and directories based on a provided prompt. It allows you to quickly create project structures without the need to follow code best practices or generate the maximum number of files.

## Installation

To install the Scaffold CLI, you need to have Node.js and npm installed on your system. If you don't have them already, you can download and install them from the official Node.js website (https://nodejs.org/).

Once you have Node.js and npm installed, you can install the Scaffold CLI globally using the following npm command:

```bash
npm install -g scaffold-cli
```

After the installation is complete, you can run the CLI using the `scaffold` command.

## Usage

To use the Scaffold CLI, you need to create a file named `prompt.txt` in your current working directory. The CLI will use the content of this file as the prompt for GPT-4. Additionally, you can include specific instructions or requirements for file and directory generation in the `prompt.txt` file.

For example, your `prompt.txt` file could look like this:

```plaintext
Create a simple web application.
- Generate an index.html file with basic HTML structure.
- Add a styles.css file for CSS styles.
- Create a main.js file for JavaScript logic.
```

After creating the `prompt.txt` file, you can run the Scaffold CLI by executing the following command in your terminal:

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

The Scaffold CLI supports debugging by using the `SCAFFOLD_DEBUG` environment variable. If you want to enable debugging mode to log the received response from GPT-4, you can set the `SCAFFOLD_DEBUG` variable to "true" before running the CLI:

```bash
export SCAFFOLD_DEBUG=true
scaffold
```

In debugging mode, the CLI will log the GPT-4 response to a file named `.responses.json` in the current working directory.

## Important Notes

- The Scaffold CLI requires an OpenAI API key to communicate with GPT-4. Before running the CLI, ensure that you have set the `SCAFFOLD_APIKEY` environment variable with your valid API key.

- The CLI uses the GPT-4 model "gpt-4-0613" by default. If you want to use a different GPT-4 model, you can modify the `model` parameter in the CLI code.

- The Scaffold CLI assumes that you have internet connectivity to interact with the OpenAI API and GPT-4.

## Conclusion

With the Scaffold CLI, generating project structures and files becomes a breeze. Quickly create the files and directories you need based on your prompt, and start coding without worrying about best practices or manual setup. Happy coding!