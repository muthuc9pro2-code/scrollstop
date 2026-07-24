from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = "HS256"