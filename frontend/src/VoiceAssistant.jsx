import React, { useState, useEffect, useRef } from 'react'
import { FaMicrophone, FaMicrophoneSlash, FaVolumeUp, FaRobot } from 'react-icons/fa'

const VoiceAssistant = ({ onResponse }) => {
  const [isListening, setIsListening] = useState(false)
  const [command, setCommand] = useState('')
  const [response, setResponse] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }
      
      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript
        setCommand(transcript)
        await processVoiceCommand(transcript)
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    } else {
      console.warn('Speech recognition not supported in this browser.')
    }
  }, [])

  const processVoiceCommand = async (text) => {
    try {
      const response = await fetch('http://localhost:8000/voice/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      })
      
      const data = await response.json()
      setResponse(data.response)
      
      if (onResponse) {
        onResponse(data.response)
      }
      
      // Speak the response
      speakText(data.response)
      
    } catch (error) {
      console.error('Error processing voice command:', error)
      setResponse('Sorry, I encountered an error. Please try again.')
    }
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Configure voice
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      utterance.onend = () => {
        setIsSpeaking(false)
      }
      
      utterance.onerror = () => {
        setIsSpeaking(false)
      }
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.')
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  const quickCommands = [
    { text: "Car Status", command: "What's my car status?" },
    { text: "Check Speed", command: "What's my current speed?" },
    { text: "Fuel Level", command: "How much fuel do I have?" },
    { text: "Engine Temp", command: "What's the engine temperature?" },
    { text: "Trip Info", command: "What's my trip distance?" },
    { text: "Help", command: "What can you do?" }
  ]

  return (
    <div className="voice-assistant">
      <div className="assistant-header">
        <FaRobot className="assistant-icon" />
        <h2>Car Assistant</h2>
        <span className="assistant-status">
          {isListening ? 'Listening...' : 'Ready'}
        </span>
      </div>

      {/* Voice Input Section */}
      <div className="voice-input-section">
        <button 
          className={`voice-button ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          disabled={isSpeaking}
        >
          {isListening ? (
            <>
              <FaMicrophoneSlash />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <FaMicrophone />
              <span>Tap to Speak</span>
            </>
          )}
        </button>
        
        {isListening && (
          <div className="listening-animation">
            <div className="pulse-circle"></div>
            <div className="pulse-circle"></div>
            <div className="pulse-circle"></div>
          </div>
        )}
      </div>

      {/* Command History */}
      <div className="conversation-history">
        {command && (
          <div className="user-message">
            <div className="message-header">You said:</div>
            <div className="message-content">{command}</div>
          </div>
        )}
        
        {response && (
          <div className="assistant-message">
            <div className="message-header">Assistant:</div>
            <div className="message-content">{response}</div>
            <button 
              className="speak-button"
              onClick={() => speakText(response)}
              disabled={isSpeaking}
            >
              <FaVolumeUp />
              {isSpeaking ? 'Speaking...' : 'Speak again'}
            </button>
          </div>
        )}
      </div>

      {/* Quick Commands */}
      <div className="quick-commands-section">
        <h3>Quick Commands</h3>
        <div className="quick-commands-grid">
          {quickCommands.map((qc, index) => (
            <button
              key={index}
              className="quick-command"
              onClick={() => processVoiceCommand(qc.command)}
            >
              {qc.text}
            </button>
          ))}
        </div>
      </div>

      {/* Sample Commands */}
      <div className="sample-commands">
        <h4>Try saying:</h4>
        <ul>
          <li>"What's my current speed?"</li>
          <li>"Check engine temperature"</li>
          <li>"How much fuel is left?"</li>
          <li>"What's the RPM?"</li>
          <li>"Is everything okay with the car?"</li>
        </ul>
      </div>
    </div>
  )
}

export default VoiceAssistant