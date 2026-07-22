from fastapi import APIRouter
from app.schemas.auth_schema import UserSignup
from app.auth.hashing import hash_password

router = APIRouter()

@router.post("/signingup")
def signup(user: UserSignup):

    hashed_password = hash_password(user.password)

    return {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password
    }