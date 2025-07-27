# Perga Web

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Build](https://github.com/dbtiunov/perga-web/actions/workflows/ci.yml/badge.svg)

Personal organizer that helps you plan and organize your days and months efficiently.

## Features

- Daily planner
- Monthly agenda and backlog
- User authentication and settings
- Responsive design with mobile support

## Roadmap

- Notes
- Projects
- Mobile app

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (v8 or higher recommended)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dbtiunov/perga-web.git
   cd perga-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
   
   Update the `VITE_API_BASE_URL` if needed.

## Development

### Starting the Development Server

```bash
npm run dev
```

This will start the Vite development server, typically at http://localhost:5173.

### Building for Production

```bash
npm run build
```

This will:
1. Run TypeScript type checking
2. Build the application with Vite
3. Output the built files to the `dist` directory


## Docker

The application can be run in a Docker container:

```bash
# Build and start the container
docker-compose up -d

# Stop the container
docker-compose down
```

The application will be available at http://localhost:3000.

## Project Structure

```
perga-web/
├── src/                  # Source code
│   ├── api/              # API-related code
│   ├── assets/           # Static assets
│   ├── common/           # Shared components and utilities
│   ├── contexts/         # React contexts
│   ├── sections/         # Main application sections
│   │   ├── auth/         # Authentication components
│   │   ├── planner/      # Planning functionality
│   │   └── settings/     # User settings
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Public assets
├── .env.example          # Example environment variables
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Docker configuration
├── index.html            # HTML entry point
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Path Aliases

The project uses path aliases to simplify imports:

- `@`: src
- `@api`: src/api
- `@assets`: src/assets
- `@common`: src/common
- `@contexts`: src/contexts
- `@sections`: src/sections
- `@auth`: src/sections/auth
- `@planner`: src/sections/planner
- `@settings`: src/sections/settings

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
