## Snippet.app

The application's primary function is to provide quick and easy access to text fragments that the user frequently copies and pastes. Whether it's code snippets, standard email responses, or any other repetitive text elements, this application will help you save time and increase productivity by eliminating the need for constant manual copying and pasting.

## Brief Demo

![snippet-demo](https://github.com/deanglukler/snippet/assets/32249655/561e84b4-4538-4c3e-a51d-a3eda6487e86)

---

## Overview

### Technology

This application is built using Electron.js for desktop development, React.js for user interfaces, Typescript for static typing, and Loki.js as an in-memory document database.

### Features

- Quickly add snippets from the clipboard
- Copy anything with a single click
- Search text
- Filter by "liked" or "tagged" snippets
- View long snippets in expanded or collapsed format
- Choose between light, dark, or system color schemes

## Installation and Development

To start with the application:

1. Ensure Node.js and NPM are installed on your system
2. Clone the repository
3. Execute `npm install` in the repo's directory
4. To start the app in the development environment, use the command `npm start`

For Packaging the application for production, run `npm run package`.

```bash
npm run package
```

## Folders and Project StructureProject Structure

- `assets`: Stores static assets, such as images.
- `biz`: Contains business-related elements like logo design.
- `src`: Holds all source code.
- `src/main`: Contains source code related to the Node.js and Electron side.
- `src/renderer`: Holds source code for the front-end browser React app.
