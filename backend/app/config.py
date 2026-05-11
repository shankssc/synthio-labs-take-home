from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str = ""
    environment: str = "local"

    model_config = {"env_file": ".env"}


settings = Settings()
