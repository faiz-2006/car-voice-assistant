# Placeholder for main.py
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import asyncio
import json
from datetime import datetime

from obd_service import obd_service
from voice_processor import voice_assistant
from config import config

app = FastAPI(title="Car Voice Assistant API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Car Voice Assistant API",
        "endpoints": {
            "obd_data": "/obd",
            "voice_command": "/voice/command",
            "websocket": "/ws"
        }
    }

@app.get("/obd")
def get_obd_data():
    """Get current OBD data"""
    return obd_service.get_all_data()

@app.get("/obd/{parameter}")
def get_specific_obd_data(parameter: str):
    """Get specific OBD parameter"""
    return obd_service.get_specific_data(parameter)

@app.post("/voice/command")
async def process_voice_command(command_data: dict):
    """
    Process voice command
    Expected format: {"text": "your voice command here"}
    """
    text = command_data.get("text", "").strip()
    
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")
    
    # Get current OBD data
    obd_data = obd_service.get_all_data()
    
    # Process with AI
    response = voice_assistant.process_with_ai(text, obd_data)
    
    # Optionally speak the response
    # voice_assistant.speak(response)
    
    return {
        "original_command": text,
        "response": response,
        "obd_data": obd_data,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/voice/speak")
async def text_to_speech(tts_data: dict):
    """Convert text to speech"""
    text = tts_data.get("text", "")
    if text:
        voice_assistant.speak(text)
        return {"status": "spoken", "text": text}
    return {"status": "no text provided"}

# WebSocket for real-time OBD data
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Get OBD data
            data = obd_service.get_all_data()
            
            # Send to connected client
            await websocket.send_json(data)
            
            # Update every 2 seconds
            await asyncio.sleep(2)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "obd_connected": obd_service.is_connected,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    print(f"🚗 Starting Car Voice Assistant on port {config.PORT}")
    print(f"📡 OBD Status: {'Connected' if obd_service.is_connected else 'Disconnected'}")
    print(f"🔑 OpenAI: {'Configured' if config.OPENAI_API_KEY else 'Not configured'}")
    print(f"🔑 Gemini: {'Configured' if config.GOOGLE_API_KEY else 'Not configured'}")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=config.PORT,
        reload=config.DEBUG
    )