# 📊 Data Science & Algorithms Chatbot

A full-stack AI chatbot for answering questions based on custom PDFs related to Data Science and Algorithms. It uses LangChain, Hugging Face embeddings, Pinecone for vector storage, and Google's Gemini API. The frontend is built with **React.js** and **Tailwind CSS**.

---

## 🧠 Features

- 🗂️ Ingests and indexes PDF documents using Hugging Face embeddings.
- 📚 Stores and retrieves vector data using Pinecone.
- 🤖 Uses Google's Gemini model via LangChain for question-answering.
- 🧩 Semantic search with contextual answers.
- 🌐 REST API built with Flask and CORS support.
- ⚡ Modern frontend with React and Tailwind CSS.

---

## 🚀 Quick Start

### Local Development

1. **Backend Setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   # Create .env file with your API keys
   python app2.py
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Deployment

1. **Prerequisites:**
   - Docker and Docker Compose installed
   - Create `.env` file in root directory with your API keys:
     ```bash
     cp .env.example .env
     # Edit .env with your actual API keys
     ```

2. **Deploy with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080

4. **To stop the containers:**
   ```bash
   docker-compose down
   ```

---

## 🐳 Docker Architecture

- **Backend Container:** Python Flask app with all dependencies
- **Frontend Container:** React app served by Nginx
- **Networking:** Containers communicate via Docker bridge network
- **Environment Variables:** API keys passed securely via environment

---

## 📝 Environment Variables

Create a `.env` file in the project root:

```env
PINECONE_API_KEY=your_pinecone_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
```

---

## 🔧 Technical Stack

- **Backend:** Python, Flask, LangChain, Pinecone, Google Gemini
- **Frontend:** React, Vite, Tailwind CSS, React Icons
- **Deployment:** Docker, Docker Compose, Nginx
- **AI/ML:** Hugging Face Embeddings, Vector Search, RAG Pipeline

