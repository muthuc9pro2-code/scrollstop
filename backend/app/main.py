from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.hook import HookRequest
from app.services.hook_service import generate_hook

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def root():
    return {"messeage": "Hook generator API is running!"}


@app.post("/generate")
def generate(request: HookRequest):
    hook = generate_hook(
        request.description,
        request.platform, 
        request.tone, 
        request.language
        )
    return {
        "hooks": hook
        }

