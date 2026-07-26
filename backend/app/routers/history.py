from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from auth.jwt import get_current_active_user
from models.user import History, User
from schemas.auth_schema import HistoryCreate

router = APIRouter()

@router.post("/history")
def save_history(
    history: HistoryCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
    ):

    existing_history = db.query(
        History).filter(
            History.user_id == current_user.id,
            History.description == history.description
            ).first()




