from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "mysql+pymysql://root:996232@mysql-db:3306/scrollstop"

engine = create_engine(DATABASE_URL)

sessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
)

class Base(DeclarativeBase):
    pass

def get_db():
    db = sessionLocal()
    try: 
        yield db
    finally:
        db.close()