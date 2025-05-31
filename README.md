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

## 📁 Project Structure

├── app.py # Flask backend server
├── helper.py # Helper functions for loading, splitting, and embedding
├── store_index.py # Script to load PDFs and populate Pinecone index
├── prompt.py # System prompt for Gemini
├── Data/ # Folder containing input PDFs
├── .env # API keys and secrets
├── frontend/ # React + Tailwind CSS frontend 


