from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Railway injects DATABASE_URL automatically when you add a Postgres plugin
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://stockflow:stockflow123@localhost:5432/stockflow_db"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey-change-in-production")
    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3001,http://localhost:3000,http://localhost:5173"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()
