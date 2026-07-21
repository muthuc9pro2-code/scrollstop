from pydantic import BaseModel

class HookRequest(BaseModel):
    description : str
    platform : str
    tone : str
    language: str
    previous_hooks: list[str] | None = None
    