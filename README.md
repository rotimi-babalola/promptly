# Promptly

Promptly is an AI-powered language learning platform that helps users practice German through interactive speaking and writing exercises. The application provides real-time feedback on pronunciation, grammar, vocabulary, and structure using advanced language models.

## Features

### Language Learning Capabilities

- **Speaking Practice**: Record audio responses to prompts and receive AI feedback on fluency, grammar, vocabulary, and pronunciation
- **Writing Practice**: Submit written responses and get detailed corrections, grammar feedback, and improvement suggestions
- **Adaptive Learning**: Choose from beginner, intermediate, or native difficulty levels
- **Real-time Feedback**: Powered by OpenAI's GPT-4 and Whisper models for accurate language assessment
- **Audio Transcription**: Automatic speech-to-text conversion for speaking exercises

### Technical Features

- **Frontend**: Built with React, TypeScript, and Vite with modern UI components
- **Backend**: NestJS-powered API with LangChain integration for AI processing
- **Authentication**: Secure user authentication via Supabase
- **Rate Limiting**: Built-in throttling to manage API usage
- **Internationalization**: Multi-language support with i18next
- **Audio Processing**: Browser-based audio recording and playback

### Docker

- Fully containerized application with Docker Compose
- Separate containers for frontend and backend services
- Easy deployment and development setup

---

## Project Structure

```
.
├── backend/           # NestJS API server
│   ├── src/
│   │   ├── auth/      # Supabase authentication guards
│   │   ├── langchain/ # AI chains for feedback generation
│   │   ├── speak/     # Speaking practice endpoints
│   │   ├── write/     # Writing practice endpoints
│   │   └── ...
│   ├── test/          # Unit and e2e tests
│   ├── Dockerfile     # Backend Docker configuration
│   └── ...
├── frontend/          # React + Vite client
│   ├── src/
│   │   ├── pages/     # Main application pages
│   │   │   ├── speak/ # Speaking practice interface
│   │   │   ├── write/ # Writing practice interface
│   │   │   └── ...
│   │   ├── components/# Reusable UI components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── services/  # API communication
│   │   └── locales/   # Internationalization files
│   ├── public/        # Static assets
│   ├── Dockerfile     # Frontend Docker configuration
│   └── ...
├── docker-compose.yml # Multi-container orchestration
└── README.md          # Project documentation
```

---

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (v18+ for local development)
- OpenAI API key for AI-powered feedback
- Supabase project for authentication (optional for local development)

---

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd promptly
   ```

2. Set up environment variables:

   ```bash
   # Backend environment variables
   cp backend/.env.example backend/.env
   # Add your OpenAI API key and other required variables
   ```

3. Build and start the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:8000](http://localhost:8000)

The application will be ready for language learning practice once both services are running!

---

## Development

### Frontend (Language Learning Interface)

To run the frontend locally:

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend includes:

- Speaking practice page with audio recording
- Writing practice page with text input
- Real-time feedback display
- Language level selection

### Backend (AI Processing API)

To run the backend locally:

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (copy `.env.example` to `.env`)

4. Start the development server:
   ```bash
   npm run start:dev
   ```

The backend provides:

- `/speak` endpoints for audio processing and feedback
- `/write` endpoints for text analysis and corrections
- LangChain integration for AI-powered language assessment

---

## Testing

### Frontend Tests

Run linting and tests for the language learning interface:

```bash
cd frontend
npm run lint     # ESLint code quality checks
npm run test     # Vitest unit tests for components and hooks
```

### Backend Tests

Run comprehensive tests for the AI processing backend:

```bash
cd backend
npm run test     # Unit tests for language processing services
npm run test:e2e # End-to-end API tests
npm run lint     # ESLint code quality checks
```

The test suite covers:

- Audio processing and transcription
- AI feedback generation
- Language level assessment
- Rate limiting functionality

---

## Usage

### Speaking Practice

1. Navigate to the Speaking Practice page
2. Select your language level (Beginner/Intermediate/Native)
3. Read the displayed prompt
4. Record your audio response
5. Submit for AI analysis
6. Review feedback on fluency, grammar, vocabulary, and pronunciation

### Writing Practice

1. Navigate to the Writing Practice page
2. Select your language level
3. Read the writing prompt
4. Type your response (minimum 5 words)
5. Submit for AI analysis
6. Review corrections, grammar feedback, and improvement suggestions

---

## Environment Variables

### Backend Configuration

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server configuration
PORT=8000
```

### Frontend Configuration

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API endpoint
VITE_API_URL=http://localhost:8000
```

---

## Deployment

### Production Deployment

1. Ensure environment variables are properly configured for production
2. Build Docker images:

   ```bash
   docker-compose build
   ```

3. Deploy using your preferred container orchestration platform (Docker Swarm, Kubernetes, etc.)

### Environment-Specific Notes

- Set `NODE_ENV=production` for the backend
- Configure CORS settings for your production domain
- Set up proper SSL/TLS certificates
- Configure rate limiting for production traffic
- Ensure OpenAI API key has sufficient quota for expected usage

---

## Technologies Used

### AI & Language Processing

- **OpenAI GPT-4**: Advanced language understanding and feedback generation
- **OpenAI Whisper**: Accurate speech-to-text transcription
- **LangChain**: Framework for building AI-powered language applications

### Frontend

- **React 18**: Modern user interface framework
- **TypeScript**: Type-safe development
- **Vite**: Fast development and build tooling
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component library
- **React Query**: Server state management
- **i18next**: Internationalization

### Backend

- **NestJS**: Progressive Node.js framework
- **Express**: HTTP server framework
- **Supabase**: Authentication and database
- **Redis**: Rate limiting and caching
- **Jest**: Comprehensive testing framework

### DevOps

- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Support

If you encounter any issues or have questions about using Promptly for language learning, please open an issue on GitHub
