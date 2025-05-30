# app.py

from flask import Flask, render_template, jsonify, request
from Hackvortex_Hackathon.backend.helper import downloadHuggingFaceEmbeddings # Only need embeddings for queries
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from Hackvortex_Hackathon.backend.prompt import *        # Assuming prompt.py contains system_prompt
import os

app = Flask(__name__)

# Attain API Keys from .env and set them in environment variables
load_dotenv()
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found in environment variables.")
if not GOOGLE_API_KEY:
     raise ValueError("GOOGLE_API_KEY not found in environment variables.")

# Langchain integrations often read directly from os.environ,
# but explicitly setting them again here is harmless if needed by older versions
# os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY # Redundant due to load_dotenv()
# os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY # Redundant due to load_dotenv()


# --- Initialize Components ---

# Download/Load Embeddings from HuggingFace (Needed for querying the index)
print("Loading Embeddings model for querying...")
embeddings = downloadHuggingFaceEmbeddings()

# Initialize Pinecone Connection and Connect to Existing Index
print("Connecting to Pinecone index...")
index_name = "data-science-algo-bot"
try:
    # Use from_existing_index to connect to an index that should already be populated
    docsearch = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings, # Pass the embedding model instance
        # namespace="your_namespace" # Optional: if you are using namespaces
    )
    print(f"Successfully connected to Pinecone index '{index_name}'.")

except Exception as e:
    print(f"Error connecting to Pinecone index '{index_name}': {e}")
    print("Ensure you have run store_index.py first to create and populate the index.")
    exit() # Exit the application if connection fails


# Document Retriever that accesses our Knowledge Base
print("Setting up retriever...")
retriever = docsearch.as_retriever(
    search_type='similarity',
    search_kwargs={'k':3}
)
print("Retriever ready.")


# Initialize LLM
print("Initializing LLM...")
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash", # Ensure you have access to this model
    temperature=0.5,
)
print("LLM initialized.")


# Set up the System Message
# Assuming system_prompt is imported from prompt.py
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt), # system_prompt comes from prompt.py
        ("human", "{input}"),
    ]
)

# Initialize RAG Chain
print("Setting up RAG chain...")
# Note: create_stuff_documents_chain requires prompt and llm
# create_retrieval_chain requires retriever and the document_chain
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)
print("RAG chain ready.")


# # --- Flask Routes ---

# # First Route: The Consumer will access the interface of the application
# @app.route("/")
# def index():
#     return render_template('chat.html')

# # Second Route: This is for the Chat Operation
# # Uncomment this route when you are ready to test the chat interface
# @app.route("/get", methods=["GET", "POST"])
# def chat():
#     # Assuming the request method is POST from your commented out code logic
#     if request.method == "POST":
#         msg = request.form["msg"]
#     else: # Handle GET for direct testing if needed
#          msg = request.args.get("msg", "") # Use .get for safety

#     input = msg # Just copying msg to input, not strictly necessary

#     print(f"Received message: {input}") # Debug print

#     # Invoke the RAG chain
#     try:
#         # The invoke method expects a dictionary with the 'input' key
#         response = rag_chain.invoke({"input": input})
#         print("RAG chain response generated.")
#         # The response object is a dictionary, the answer is typically under 'answer'
#         bot_response = response.get("answer", "Sorry, I could not get a response.")
#         print("Response : ", bot_response)

#         return str(bot_response) # Return the answer as a string

#     except Exception as e:
#         print(f"Error during RAG chain invocation: {e}")
#         # Return an error message to the user
#         return jsonify({"error": "An error occurred while processing your request."}), 500


# # --- Run the Flask App ---
# # Uncomment this block to run the Flask development server
# if __name__ == '__main__':
#     print("Starting Flask app...")
#     app.run(
#         host="0.0.0.0", # Makes the server externally visible (useful for Docker/networks)
#         port=8080,
#         debug=True # Set to False in production
#     )



# --- Terminal Testing Block ---
if __name__ == '__main__':
    # !!! COMMENT OUT OR REMOVE THE app.run() CALL IF IT'S PRESENT AND UNCOMMENTED !!!
    # app.run(...) # Ensure this line is commented out or removed for terminal testing

    print("\n--- RAG Chain Terminal Test ---")
    print("Enter your queries below. Type 'quit' or press Ctrl+C to exit.")

    while True:
        try:
            # Get user input from the terminal
            user_input = input("You: ")

            # Exit condition
            if user_input.lower() == 'quit':
                break

            if not user_input.strip():
                print("Please enter a query.")
                continue

            # Invoke the RAG chain
            # The invoke method expects a dictionary with the 'input' key
            print("Thinking...")
            response = rag_chain.invoke({"input": user_input})

            # Print the results
            # The response object from create_retrieval_chain is a dictionary
            # It typically contains 'input', 'context', and 'answer'
            print("\n--- Response ---")
            print("Bot:", response.get("answer", "Sorry, I could not get a response."))

            # Optional: Print the retrieved context (useful for debugging)
            # print("\n--- Retrieved Context ---")
            # retrieved_docs = response.get("context", [])
            # if retrieved_docs:
            #     for i, doc in enumerate(retrieved_docs):
            #         print(f"Document {i+1} (Source: {doc.metadata.get('source', 'N/A')}):")
            #         print(doc.page_content[:500] + "...") # Print first 500 chars
            #         print("-" * 20)
            # else:
            #      print("No relevant documents retrieved.")
            print("----------------\n")

        except KeyboardInterrupt:
            # Handle Ctrl+C
            print("\nExiting terminal test.")
            break
        except Exception as e:
            # Handle other potential errors during inference
            print(f"\nAn error occurred: {e}")
            # print("Please check your API keys, model availability, or data connection.")
            print("----------------\n")

