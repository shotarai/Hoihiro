import os

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException

chat_router = APIRouter()

load_dotenv()

api_key = os.getenv("GENAI_API_KEY")

if not api_key:
    print("API Key not found. Please check your .env file.")
    raise RuntimeError("API Key is required")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-pro")

FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "document.txt")


def read_file_content(file_path: str) -> str:
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return ""


@chat_router.get("/chat/{keyword}", response_model=str)
def send_response(keyword: str):
    try:
        file_content = read_file_content(FILE_PATH)

        prompt = f"以下のドキュメントをもとに次の質問「{keyword}」に対して解答を考えて下さい:\n\n{file_content}\nResponse:"

        response = model.generate_content(prompt)

        content = response.candidates[0].content.parts[0].text

        return content

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
