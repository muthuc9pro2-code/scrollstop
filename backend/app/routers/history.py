from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.auth.jwt import get_current_active_user
from app.models.user import History, User
from app.schemas.auth_schema import HistoryCreate

router = APIRouter()

@router.post("/history")
def save_history(
    history: HistoryCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
    ):

    new_history = History(
        user_id = current_user.id,
        description = history.description,
        platform = history.platform,
        tone = history.tone,
        language = history.language,
        hooks = "\n".join(history.hooks),
    )

    db.add(new_history)
    db.commit()
    db.refresh(new_history)

    return new_history

@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
    ):
    history = (
        db.query(History)
        .filter(History.user_id == current_user.id)
        .order_by(History.id.desc())
        .all()
    )
    return history







