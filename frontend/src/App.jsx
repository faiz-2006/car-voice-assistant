import React, { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import VoiceAssistant from './VoiceAssistant'
import OBDMonitor from './OBDMonitor'
import './styles.css'

function App() {
  const [obdData, setObdData] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [latestResponse, setLatestResponse] = useState('')

  // Fetch initial OBD data
  useEffect(() => {
    fetchOBDData()
    const interval = setInterval(fetchOBDData, 2000) // Update every 2 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchOBDData = async () => {
    try {
      const response = await fetch('http://localhost:8000/obd')
      const data = await response.json()
      setObdData(data)
      setIsConnected(data.connected !== false)
    } catch (error) {
      console.error('Error fetching OBD data:', error)
      setIsConnected(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🚗 Car Voice Assistant</h1>
          <div className="connection-status">
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>OBD-II {isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="dashboard-container">
          <div className="obd-panel">
            <h2>📊 Vehicle Status</h2>
            <OBDMonitor data={obdData} />
          </div>

          <div className="voice-panel">
            <h2>🎤 Voice Assistant</h2>
            <VoiceAssistant 
              onResponse={(response) => setLatestResponse(response)}
            />
            
            {latestResponse && (
              <div className="assistant-response">
                <h3>Latest Response:</h3>
                <p>{latestResponse}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Car Dashboard Voice Assistant | OBD-II Integration | © 2024</p>
      </footer>
    </div>
  )
}

export default App