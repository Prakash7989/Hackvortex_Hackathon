# helper.py

from langchain_community.document_loaders import PDFMinerLoader, DirectoryLoader
from langchain.text_splitter import Language, RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document  # Explicitly import Document for clarity/type hinting


def load_pdf_file(data: str) -> list[Document]:
    """
    Loads PDF documents from a directory using LangChain's DirectoryLoader.

    Args:
        data: The path to the directory containing PDF files.

    Returns:
        A list of LangChain Document objects.
    """
    print(f"Loading documents from {data}...")
    try:
        loader = DirectoryLoader(
            data,
            glob="*.pdf",
            loader_cls=PDFMinerLoader,
            show_progress=True
        )
        documents = loader.load()
        print(f"Loaded {len(documents)} documents.")
        return documents
    except Exception as e:
        print(f"Error loading documents: {e}")
        return []


def downloadHuggingFaceEmbeddings():
    
    model_name = "BAAI/bge-large-en-v1.5"
    return HuggingFaceEmbeddings(model_name=model_name)


def text_split(extracted_data):
    text_splitter = RecursiveCharacterTextSplitter.from_language(
        language=Language.PYTHON,  # Change to Language.JAVASCRIPT, Language.JAVA, etc. if needed
        chunk_size=500,
        chunk_overlap=20
    )
    text_chunks = text_splitter.split_documents(extracted_data)
    return text_chunks