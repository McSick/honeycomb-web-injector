# OpenTelemetry Injector Chrome Extension

This Chrome extension injects the Honeycomb OpenTelemetry web SDK into specified pages based on a user-defined pattern. It includes options to enable or disable the injection and to configure the necessary API key and service name.

## Features

- Injects Honeycomb OpenTelemetry SDK into pages that match a user-defined pattern
- Allows users to configure API key and service name for the SDK
- Toggle to enable or disable the injection

## Setup

### Prerequisites

- Node.js and npm installed on your system
- Chrome browser

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/McSick/honeycomb-web-injector.git
   cd honeycomb-web-injector
   ```
2. **Load the Extension into Chrome**

   1. Open Chrome and navigate to `chrome://extensions/`
   2. Enable "Developer mode" using the toggle switch in the top right corner
   3. Click "Load unpacked" and select the directory of your extension

### Building if making changes 

1. **Install Dependencies**

   ```bash
   npm install --save @honeycombio/opentelemetry-web @opentelemetry/auto-instrumentations-web
   npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-env
   ```

2. **Build the Project**

   ```bash
   npx webpack
   ```
   
3. **Load the Extension into Chrome**

   1. Open Chrome and navigate to `chrome://extensions/`
   2. Enable "Developer mode" using the toggle switch in the top right corner
   3. Click "Load unpacked" and select the directory of your extension


## Usage

1. **Open the Options Page**

   Click on the extension icon in the Chrome toolbar, and then click on "Options".

2. **Configure the Extension**

   - **URL Pattern**: Enter the URL pattern to match the pages where the SDK should be injected.
   - **API Key**: Enter your Honeycomb Ingest API key.
   - **Service Name**: Enter the name of your service.
   - **Enable Injection**: Toggle to enable or disable the script injection.

3. **Save the Configuration**

   After entering the required information, click "Save". The extension will now inject the SDK into the pages that match the specified pattern, provided the injection is enabled.

## Development

### File Structure

- `manifest.json`: Defines the extension’s properties and permissions.
- `background.js`: Handles the background processes and injects content scripts.
- `content.js`: Injects the SDK bundle and communicates with the page.
- `options.html`: The options page for configuring the extension.
- `options.js`: Handles the logic for the options page.
- `src/tracing.js`: Contains the tracing logic and exposes the `startTracing` function.
- `webpack.config.js`: Webpack configuration for bundling the `tracing.js`.

### Build Commands

- **Install Dependencies**: `npm install`
- **Build the Project**: `npx webpack`

### Adding a New Feature

1. Modify the relevant files in the `src` directory.
2. Rebuild the project using `npx webpack`.
3. Reload the extension in Chrome to apply the changes.

### Troubleshooting

- Ensure that all required fields in the options page are correctly filled.
- Check the Chrome Developer Tools console for any error messages or logs.
- Ensure that the pattern matches the URL of the pages where you want to inject the SDK.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

