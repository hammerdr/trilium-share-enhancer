# Trilium Enhancer Plugin

A JavaScript plugin that enhances Trilium public share pages with improved navigation, dark/light mode toggle, and better styling.

## Features

- Dark/Light mode toggle with persistent theme preference
- Collapsible navigation for better organization
- Smooth scrolling for better navigation
- Improved typography and spacing
- Enhanced code block styling
- Modern, clean design

## Installation

1. Copy the contents of `trilium-enhancer.js` to your Trilium public share page
   - You can do this by creating a new note with the JavaScript code
   - Or by adding it to your Trilium configuration

2. Make sure the script is loaded after the Trilium DOM is ready

## Usage

- Click the theme toggle button (sun/moon icon) in the top-right corner to switch between dark and light modes
- Click the arrow icons next to navigation items to expand/collapse their children
- Use smooth scrolling by clicking on any links

## Customization

The plugin uses CSS variables for theming. You can customize the colors by modifying these variables in your CSS:

```css
:root {
    --primary-color: #your-color;
    --text-color: #your-color;
    --background-color: #your-color;
    /* Add more variables as needed */
}

.dark-mode {
    --primary-color: #your-dark-mode-color;
    --text-color: #your-dark-mode-color;
    --background-color: #your-dark-mode-color;
}
```
