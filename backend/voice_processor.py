# Placeholder for voice_processor.py
import speech_recognition as sr
import pyttsx3
import openai
import google.generativeai as genai
from config import config
from typing import Optional, Dict, Any

class VoiceAssistant:
    def __init__(self):
        # Initialize speech recognition
        self.recognizer = sr.Recognizer()
        
        # Initialize text-to-speech
        self.tts_engine = pyttsx3.init()
        self.tts_engine.setProperty('rate', 150)
        self.tts_engine.setProperty('volume', 0.9)
        
        # Initialize AI models
        self.setup_ai_models()
    
    def setup_ai_models(self):
        """Setup OpenAI and Gemini API clients"""
        # OpenAI
        if config.OPENAI_API_KEY:
            openai.api_key = config.OPENAI_API_KEY
            print("✅ OpenAI API configured")
        
        # Google Gemini
        if config.GOOGLE_API_KEY:
            genai.configure(api_key=config.GOOGLE_API_KEY)
            print("✅ Google Gemini API configured")
    
    def listen(self, audio_source) -> str:
        """Convert speech to text using multiple fallback methods"""
        try:
            audio = self.recognizer.listen(audio_source, timeout=5, phrase_time_limit=5)
            
            # Method 1: Google Web Speech API (Free)
            try:
                text = self.recognizer.recognize_google(audio)
                print(f"🎤 Recognized: {text}")
                return text.lower()
            except:
                pass
            
            # Method 2: If you have Whisper API from OpenAI
            if config.OPENAI_API_KEY:
                try:
                    import tempfile
                    import io
                    # Convert audio to file and use Whisper
                    # Implementation depends on your audio format
                    pass
                except:
                    pass
            
            return "Sorry, I couldn't understand that."
            
        except sr.WaitTimeoutError:
            return "No speech detected."
        except Exception as e:
            return f"Error: {str(e)}"
    
    def process_with_ai(self, text: str, obd_data: Dict[str, Any]) -> str:
        """Process voice command with AI (OpenAI or Gemini)"""
        # Build context with OBD data
        context = f"""
        You are a car dashboard voice assistant. 
        Current car status:
        - Speed: {obd_data.get('speed', {}).get('value', 0)} {obd_data.get('speed', {}).get('unit', 'km/h')}
        - RPM: {obd_data.get('rpm', {}).get('value', 0)}
        - Engine Temperature: {obd_data.get('temperature', {}).get('value', 0)}°C
        - Fuel Level: {obd_data.get('fuel', {}).get('value', 0)}%
        
        User command: {text}
        
        Provide a helpful response considering the car's current status.
        Keep responses concise and car-focused.
        """
        
        # Try OpenAI GPT
        if config.OPENAI_API_KEY:
            try:
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are a helpful car assistant."},
                        {"role": "user", "content": context}
                    ],
                    max_tokens=100,
                    temperature=0.7
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                print(f"OpenAI Error: {e}")
        
        # Try Google Gemini
        if config.GOOGLE_API_KEY:
            try:
                model = genai.GenerativeModel('gemini-pro')
                response = model.generate_content(context)
                return response.text.strip()
            except Exception as e:
                print(f"Gemini Error: {e}")
        
        # Fallback to rule-based responses
        return self.fallback_response(text, obd_data)
    
    def fallback_response(self, text: str, obd_data: Dict[str, Any]) -> str:
        """Fallback rule-based responses if AI APIs fail"""
        text = text.lower()
        
        if any(word in text for word in ["hello", "hey", "hi"]):
            return "Hello! I'm your car assistant. How can I help?"
        
        elif any(word in text for word in ["speed", "how fast"]):
            speed = obd_data.get('speed', {}).get('value', 0)
            return f"Current speed is {speed} km/h."
        
        elif any(word in text for word in ["rpm", "engine speed"]):
            rpm = obd_data.get('rpm', {}).get('value', 0)
            return f"Engine RPM is {rpm}."
        
        elif any(word in text for word in ["temperature", "engine temp", "hot"]):
            temp = obd_data.get('temperature', {}).get('value', 0)
            return f"Engine temperature is {temp}°C."
        
        elif any(word in text for word in ["fuel", "gas", "petrol"]):
            fuel = obd_data.get('fuel', {}).get('value', 0)
            return f"Fuel level is {fuel}%."
        
        elif any(word in text for word in ["status", "how is the car"]):
            speed = obd_data.get('speed', {}).get('value', 0)
            rpm = obd_data.get('rpm', {}).get('value', 0)
            temp = obd_data.get('temperature', {}).get('value', 0)
            fuel = obd_data.get('fuel', {}).get('value', 0)
            return f"Car status: Speed {speed} km/h, RPM {rpm}, Temperature {temp}°C, Fuel {fuel}%."
        
        return "I can help with speed, RPM, temperature, fuel level, or overall car status."
    
    def speak(self, text: str):
        """Convert text to speech"""
        self.tts_engine.say(text)
        self.tts_engine.runAndWait()

# Global voice assistant instance
voice_assistant = VoiceAssistant()