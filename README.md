# WowLogAnalyzer - Vue Frontend

A modern Vue 3 web application for analyzing World of Warcraft combat logs. Upload combat log files, view detailed encounter statistics, and track player performance metrics.

## Features

- **User Authentication**: Secure JWT-based login and registration
- **Log Upload**: Drag-and-drop or file picker for combat log uploads
- **Log Management**: Browse, view, and delete uploaded logs
- **Character Profiles**: View character statistics and performance metrics
- **Encounter Analysis**: Detailed boss encounter tracking with success rates
- **Real-time Statistics**: Damage, healing, and absorb metrics per player
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **Pinia** - Intuitive state management
- **Vue Router** - Official routing solution
- **Vite** - Next-generation frontend build tool
- **Axios** - HTTP client for API requests

## Prerequisites

- [Node.js 18+](https://nodejs.org/) and npm
- Backend API running (see [backend README](../backend/README.md))

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WowLogAnalyzer/frontend-vue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the project root:
   ```env
   VITE_API_BASE_URL=http://localhost:5196
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```
   
   Production files will be generated in the `dist/` directory.

## Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | - | `http://localhost:5196` |

**Note**: Environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

## Project Structure

```
frontend-vue/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, styles, fonts
│   ├── components/     # Reusable Vue components
│   ├── router/         # Vue Router configuration
│   │   └── index.js   # Route definitions
│   ├── store/          # Pinia stores
│   │   └── auth.js    # Authentication state management
│   ├── views/          # Page components
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Logs.vue
│   │   └── Characters.vue
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── .env                # Environment variables (not in git)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js      # Vite configuration
└── README.md
```

## Available Scripts

### Development

```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR).

### Build

```bash
npm run build
```
Builds the application for production to the `dist/` directory. Optimizes and minifies code.

### Preview

```bash
npm run preview
```
Locally preview the production build before deploying.

### Lint

```bash
npm run lint
```
Runs ESLint to check code quality and style.

## Usage

### Authentication

1. **Register**: Navigate to `/register` and create a new account
2. **Login**: Use your credentials at `/login` to receive a JWT token
3. **Token Storage**: The JWT token is stored in localStorage and automatically included in API requests

### Uploading Logs

1. Navigate to the Logs page
2. Click "Upload Log" or drag and drop a `.txt` combat log file
3. Wait for the upload and parsing to complete
4. View the parsed log details and statistics

### Viewing Statistics

- **Logs Page**: Browse all uploaded logs with timestamps and file names
- **Characters Page**: View all characters extracted from logs with performance metrics
- **Encounter Details**: Click on a log to see detailed encounter information

## State Management

The application uses **Pinia** for state management:

## Styling
The application uses:
- **CSS3** for styling
- **Flexbox/Grid** for layouts
- **CSS Variables** for theming
- **Responsive Design** with media queries

## Development Guidelines

### Component Structure

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Create a `.env.production` file:

```env
VITE_API_BASE_URL=https://api.yourproductiondomain.com
```

