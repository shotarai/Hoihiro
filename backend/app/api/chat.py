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


@chat_router.get("/chat/{keyword}", response_model=str)
def send_response(keyword: str):
    try:
        prompt = (
            f"次の質問に関する解答を短く教えて下さい:\n{keyword}\nResponse:"
        )

        response = model.generate_content(prompt)

        content = response.candidates[0].content.parts[0].text

        return content

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
