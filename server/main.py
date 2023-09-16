from dotenv import load_dotenv

load_dotenv()

import uvicorn

from src.settings import get_settings

if __name__ == "__main__":
    settings = get_settings()
    uvicorn.run("src:app", host="0.0.0.0", port=settings.port, reload=True)
