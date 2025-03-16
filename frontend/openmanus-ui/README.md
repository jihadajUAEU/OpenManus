# OpenManus Frontend UI

This is the official frontend interface for OpenManus, providing a modern web interface to interact with OpenManus agents and manage their configurations.

## Features

- 🤖 Agent Configuration & Management
- ⚡ Real-time Terminal Interface
- 🔧 LLM Settings Management
- 📊 Flow Visualization & Control
- 🎨 Modern UI with Tailwind CSS
- 🔄 Redux State Management
- 📱 Responsive Design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenManus backend running locally

### Installation

1. Clone the repository:

```bash
cd OpenManus/frontend
npm install
```

2. Configure the environment:

   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` to point to your OpenManus backend

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Usage

### LLM Configuration

1. Navigate to the "Configuration" page
2. Set up your LLM model settings
3. Save the configuration to start using OpenManus

### Agent Management

1. Go to the "Agents" page
2. Create new agents with specific configurations
3. Select tools for each agent
4. Monitor agent status

### Terminal Interface

1. Access the terminal on the home page
2. Enter commands to interact with agents
3. View real-time streaming responses
4. Browse command history

### Flow Management

1. Visit the "Flow" page
2. Create and organize execution steps
3. Monitor step status
4. Manage dependencies between steps

## Architecture

The frontend is built with:

- React + TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Server-Sent Events for real-time updates

### Directory Structure

```
src/
├── components/         # React components
├── store/             # Redux store configuration
├── services/          # API and other services
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## Integration with OpenManus

This frontend interacts with OpenManus through a REST API and WebSocket connections. Make sure your OpenManus backend is properly configured and running before using the UI.

### API Endpoints

The frontend uses these main endpoints:

- `/llm/settings` - LLM configuration
- `/agents` - Agent management
- `/flow` - Flow control
- `/terminal/execute` - Command execution
- `/stream` - Real-time updates

## Support

For issues and feature requests, please use the GitHub issue tracker.

## License

MIT License - see LICENSE file for details
