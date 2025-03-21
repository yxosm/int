# PowerShell script to automate pushing a project to a GitHub repository

# Check if Git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed. Please install Git to use this script."
    exit
}

# Navigate to the project directory
$projectDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDirectory

# Initialize a Git repository if it doesn't exist
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Initialized a new Git repository."
}

# Add all files to the staging area
git add .

# Commit the changes with a message
$commitMessage = "Initial commit"  # Replace with your commit message
git commit -m $commitMessage

# Set the remote repository URL
$remoteUrl = "https://github.com/yourusername/yourrepository.git"  # Replace with your repository URL
git remote add origin $remoteUrl

# Push the changes to the specified branch
$branch = "main"  # Default branch
if (-not (git show-ref --verify --quiet refs/heads/master)) {
    $branch = "master"
}
git push -u origin $branch

Write-Host "Project pushed to GitHub repository successfully."