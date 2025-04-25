# TeachAlex

TeachAlex is an interactive learning platform that allows users to upload exam PDFs and engage in a conversational learning experience with an AI teaching assistant named Alex. The system analyzes the uploaded document, extracts key concepts, and provides a visual knowledge map to track learning progress.

## Architecture

The project follows a client-server architecture with:

- **Front End**: React-based web application with TypeScript
- **Back End**: Python Flask API server

### Front End Technologies

- React 19
- TypeScript
- Material UI 7.0
- Framer Motion for animations
- React Router for navigation
- Styled Components for styling
- Axios for API communication
- ReactFlow for knowledge graph visualization

### Back End Technologies

- Python 3.x
- Flask web framework
- Flask-CORS for cross-origin requests
- Flasgger for API documentation
- OpenAI API for:
  - Text extraction from PDFs
  - Concept extraction
  - Conversational agent

## Core Features

1. **PDF Document Upload**: Users can upload PDF files containing learning materials or exams.
2. **Text Extraction**: The system extracts text content from the uploaded PDFs.
3. **Concept Extraction**: AI analyzes the text to identify key concepts and subconcepts.
4. **Knowledge Map Visualization**: Interactive visualization displaying concepts, subconcepts, and relationships between them.
5. **Conversational Learning Interface**: Chat interface allowing users to interact with the AI teaching assistant Alex.
6. **Progressive Learning Tracking**: Visual indicators showing progress in understanding each concept.

## Project Structure

### Front End

```
Front End/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images and other static assets
│   ├── components/          
│   │   ├── canvas/          # Drawing canvas components
│   │   ├── knowledgemap/    # Knowledge map visualization components
│   │   ├── mobile/          # Mobile-specific components
│   │   ├── ChatInterface.tsx # Main chat interface component
│   │   ├── Navbar.tsx       # Navigation component
│   │   ├── PDFUpload.tsx    # PDF upload component
│   │   └── VisualizationPane.tsx # Knowledge visualization component
│   ├── contexts/            # React context providers
│   ├── services/            # API and other services
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite build configuration
```

### Back End

```
Back End/
├── app.py                   # Main Flask application
├── controller/
│   ├── conversation_controller.py  # Conversation API endpoints
│   └── extraction_controller.py    # Document extraction API endpoints
├── database/                # JSON file-based database storage
├── model/
│   ├── agents/              # AI agent implementations
│   ├── data_models/         # Data model classes
│   ├── providers/           # External API providers (e.g., OpenAI)
│   ├── Database.py          # Database operations
│   └── DocumentProcessor.py # PDF processing
└── requirements.txt         # Python dependencies
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- pip (Python package manager)

### Front End Setup

```bash
cd "Front End"
npm install
npm run dev
```

### Back End Setup

```bash
cd "Back End"
pip install -r requirements.txt
python app.py
```

## API Endpoints

### Document Processing

- `POST /extract/text` - Extract text from a PDF file
- `POST /extract/concepts` - Extract concepts from document text

### Conversation

- `POST /conversation/input` - Send user message and get AI response

## Data Flow

1. User uploads a PDF document
2. Backend extracts text from the PDF
3. AI analyzes the text to extract concepts and subconcepts
4. The knowledge map is generated based on the extracted concepts
5. User interacts with the AI through the chat interface
6. As the conversation progresses, the knowledge map updates to reflect learning progress

## Development Notes

- The front end is built with Vite for fast development and optimized production builds
- The backend uses a simple file-based JSON database for storing conversations
- CORS is configured to allow connections from the development server (localhost:5173)
- The knowledge map visualization uses a force-directed graph layout
- The system supports drawing functionality to enhance explanations

## Environment Variables

The application expects the following environment variables:

```
OPENAI_API_KEY - OpenAI API key for AI functionality
```