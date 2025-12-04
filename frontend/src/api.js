
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const api = {
  // Get OBD data
  getOBDData: () => axios.get(`${API_BASE}/obd`),
  
  // Process voice command
  processVoiceCommand: (text) => 
    axios.post(`${API_BASE}/voice/command`, { text }),
  
  // Text to speech
  textToSpeech: (text) => 
    axios.post(`${API_BASE}/voice/speak`, { text }),
  
  // Health check
  healthCheck: () => axios.get(`${API_BASE}/health`)
};