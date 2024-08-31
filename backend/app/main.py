import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import chat_router

app = FastAPI()

app.include_router(chat_router)

origins = [os.environ.get("FRONTEND_URL", "*")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}
