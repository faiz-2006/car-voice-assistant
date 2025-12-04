import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API Keys
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
    
    # OBD Settings
    OBD_PORT = os.getenv("OBD_PORT", "COM3")
    OBD_BAUDRATE = int(os.getenv("OBD_BAUDRATE", 115200))
    
    # App Settings
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    PORT = int(os.getenv("PORT", 8000))

config = Config()