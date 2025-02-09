## Requirements

1. Node.js version 20.11
2. MongoDB Atlas account

## Installation

To get the project on a PC, follow the steps:
1. **Choose a desired directory.**
In a console, change directory to a desired one, where you want the project to be installed.

2. **Clone the Repository.**
Create a SSH-key, if not created yet. Write the following command to install and get a connection to a remote repository:
```bash
git clone git@github.com:Whisky04/Simple_JS_TS_MongoDB_web_app.git
```
After cloning, the project will be installed in the desired directory on your PC.

3. **Install `npm` dependencies**
To install all listed dependencies in `package.json` run the following command in both 'client' and 'server' directories (See "Structure of the Project"):
```bash
npm install
```
After execution of the command, the project is good to go.

## Starting the Web application.

To access the web application in browser run the following command in both 'client' and 'server' directories (See "Structure of the Project"):
```bash
npm start
```
After executing the command the "frontend" and "backend" will take some time to complite loading and after a succesful run the web application will be accessable localy by the following link: "http://localhost:3000"

## Structure of the Project

There are described what are the packages in the project's repository.

- **client** - Frontend. Contains containers for frontend initialization.
- **server** - Backend. Contains models of entities and database handlers.

## Branching Strategy

This section describes how to create a proper naming for a new branch.

**Structure of the naming.**
Name the branch in the following way: 
```bash
<prefix>/<issue-id>-<short-description>
```
Where:
- `<prefix>` is one of:
  - `feature` for new features;
  - `bugfix` for bug fixes;
  - `refactor` for code refactoring/customization.
- `<issue-id>` is the ID of the related issue in your issue tracking system.
- `<short-description>` is a brief and hyphenated description of the change.

Examples:
- `feature/123-add-user-authentication`
- `bugfix/456-fix-login-error`
- `refactor/789-optimize-main-menu-code`
