from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth_schema import UserSignup, UserLogin, UserResponse
from app.auth.hashing import hash_password, verify_password
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from sqlalchemy import select
from app.auth.jwt import create_access_token, get_current_active_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/signingup")
def signup(user: UserSignup, db: Session = Depends(get_db)):

    hashed_password = hash_password(user.password)

    existing_user = db.scalar(select(User).where(User.email == user.email))
    
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already register"
        )

    user_db = User(
        username=user.username,
        email=user.email,
        password=hashed_password
        )
    
    db.add(user_db)
    db.commit()
    db.refresh(user_db)

    return {
        "id": user_db.id,
        "userName": user_db.username,
        "email": user_db.email
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = db.scalar(select(User).where(User.email == user.email))

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, existing_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": existing_user.email
        }
    )

    return{
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_active_user)
):
    return current_user

@router.get("/history")
    
    

    
    



    
