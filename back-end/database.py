import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from typing import Generator
from dotenv import load_dotenv

load_dotenv()

# Load environment variables
if not os.getenv("DB_CONN_STRING_POOL"):
    raise ValueError(
        "DB_CONN_STRING_POOL environment variable is not set. "
        "Please set it to your database connection string."
    )

SQLALCHEMY_DATABASE_URL = os.getenv("DB_CONN_STRING_POOL")

# Set up an engine that doesn't pool connections client side
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=NullPool,  # Disable SQLAlchemy's internal pooling
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Database Dependency
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
