# FitFuel [Calorie Calculator]

## Overview

FitFuel is a web application that helps users track and manage their daily calorie intake. Users can add, edit, and delete recipes and products, and the application calculates the portion sizes based on the required calorie intake to help users lose weight. The project also includes user authentication features such as login and registration.

## Features

- **Calorie Tracking**: Track the calorie intake of the added products and recipes.
- **Recipe Management**: Add, edit, and delete recipes.
- **Product Management**: Add, edit, and delete individual products.
- **User Authentication**: Secure login and registration functionality.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/calorie-calculator-ui.git
   ```
2. Navigate to the project directory:
   ```sh
   cd calorie-calculator-ui
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Application

To start the development server, run:

```sh
npm run dev
npm run build
npm run lint
```

### Project Structure

```sh
fitfuel/
├── public/          # Static assets
├── src/             # Source files
│   ├── components/  # React components
│   ├── pages/       # Next.js pages
│   ├── styles/      # CSS and style files
│   └── utils/       # Utility functions
├── .eslintrc.js     # ESLint configuration
├── next.config.js   # Next.js configuration
├── package.json     # NPM dependencies and scripts
└── tailwind.config.js # Tailwind CSS configuration

```
