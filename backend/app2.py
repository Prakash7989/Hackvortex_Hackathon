# app.py

from flask import Flask, render_template, request, jsonify
from helper import downloadHuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from prompt import system_prompt
import os

app = Flask(__name__, template_folder="../frontend")
# Load API keys
load_dotenv()
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found in environment variables.")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")

# Load Embeddings
print("Loading Embeddings...")
embeddings = downloadHuggingFaceEmbeddings()

# Connect to Pinecone index
index_name = "data-science-algo-bot"
try:
    docsearch = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings,
    )
    print(f"Connected to Pinecone index '{index_name}'.")
except Exception as e:
    print(f"Error connecting to Pinecone: {e}")
    exit()

# Retriever
retriever = docsearch.as_retriever(search_type='similarity', search_kwargs={'k': 3})

# LLM
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.5)

# Prompt and Chain
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# Flask Routes

@app.route("/")
def index():
    return render_template("chat.html")

@app.route("/get", methods=["POST"])
def chat():
    user_input = request.form.get("msg")
    if not user_input:
        return jsonify({"error": "No input provided."}), 400
    try:
        response = rag_chain.invoke({"input": user_input})
        answer = response.get("answer", "Sorry, I couldn't get a response.")
        return jsonify({"answer": answer})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
