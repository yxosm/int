# GitHub Push Automation

This project provides a PowerShell script to automate the process of pushing a project to a GitHub repository. 

## Prerequisites

- Ensure that Git is installed on your system. You can check this by running `git --version` in your PowerShell terminal.
- You need to have a GitHub account and a repository created where you want to push your project.

## Usage

1. Clone this repository or download the project files to your local machine.
2. Open PowerShell and navigate to the directory where the `GitHubPush.ps1` script is located.
3. Edit the `GitHubPush.ps1` script to set your GitHub repository URL and commit message.
4. Run the script by executing the following command:

   ```powershell
   .\GitHubPush.ps1
   ```

The script will perform the following actions:

- Check if Git is installed.
- Navigate to the project directory.
- Initialize a Git repository if it doesn't exist.
- Add all files to the staging area.
- Commit the changes with the specified message.
- Set the remote repository URL.
- Push the changes to the specified branch (defaulting to 'main' if 'master' is not found).

## Notes

- Make sure to replace the placeholder values in the script with your actual repository URL and commit message before running it.
- If you encounter any issues, ensure that your Git configuration is set up correctly and that you have the necessary permissions to push to the repository.