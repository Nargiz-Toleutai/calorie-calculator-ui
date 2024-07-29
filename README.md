# FitFuel [Calorie Calculator]

## Overview

<img align="center" alt="img" src="https://github.com/Nargiz-Toleutai/calorie-calculator-ui/blob/main/public/image.png" width="360px"/>

FitFuel is a web application that helps users track and manage their daily calorie intake. Users can add, edit, and delete recipes and products, and the application calculates the portion sizes based on the required calorie intake to help users lose weight. The project also includes user authentication features such as login and registration.

## Production

The production version of this project is available at: [FitFuel Calorie Calculator](https://fitfuel-calorie-calculator.vercel.app)

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

## Dependencies

This project uses the following main dependencies:

- `@emotion/react` & `@emotion/styled`: For styling components.
- `@headlessui/react`: For accessible UI components.
- `@hookform/resolvers` & `react-hook-form`: For form validation and handling.
- `@mui/material` & `@mui/icons-material`: Material UI for React components.
- `@radix-ui/react-*`: For building accessible and reusable components.
- `classnames` & `clsx`: Utility for conditionally joining class names.
- `cmdk`: Command menu component.
- `framer-motion`: For animations.
- `lucide-react`: Icon library.
- `next`: React framework for server-side rendering.
- `qrcode.react`: QR code component for React.
- `react` & `react-dom`: Core React libraries.
- `react-beautiful-dnd`: Drag and drop functionality.
- `react-hot-toast`: Toast notifications.
- `react-select`: Select component.
- `tailwindcss`: Utility-first CSS framework.
- `zod`: Schema declaration and validation library.

## Dev Dependencies

- `@types/*`: TypeScript type definitions.
- `eslint` & `eslint-config-next`: For linting JavaScript and TypeScript.
- `postcss`: For transforming styles with JavaScript plugins.
- `typescript`: For static type checking.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, feature requests, or improvements.

## Acknowledgements

Thanks to the developers of all the open-source packages used in this project.
