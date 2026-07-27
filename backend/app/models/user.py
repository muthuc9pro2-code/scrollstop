from sqlalchemy import Column, Integer, String, ForeignKey, Text
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    
class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(Text, nullable=False)
    platform = Column(String(50), nullable=False)
    tone = Column(String(50), nullable=False)
    language = Column(String(50), nullable=False)
    hooks = Column(Text, nullable=False)





