import React, { useEffect, useState } from 'react'

const OBDMonitor = ({ data }) => {
  const [ws, setWs] = useState(null)
  const [realTimeData, setRealTimeData] = useState(data)

  useEffect(() => {
    // WebSocket connection for real-time updates
    const websocket = new WebSocket('ws://localhost:8000/ws')
    
    websocket.onopen = () => {
      console.log('WebSocket Connected for real-time OBD data')
    }
    
    websocket.onmessage = (event) => {
      const newData = JSON.parse(event.data)
      setRealTimeData(newData)
    }
    
    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    
    websocket.onclose = () => {
      console.log('WebSocket disconnected')
    }
    
    setWs(websocket)
    
    return () => {
      if (websocket) {
        websocket.close()
      }
    }
  }, [])

  const currentData = realTimeData || data

  if (!currentData) {
    return (
      <div className="obd-monitor loading">
        <div className="loading-spinner"></div>
        <p>Connecting to OBD...</p>
      </div>
    )
  }

  const isConnected = currentData.connected !== false

  return (
    <div className="obd-monitor">
      <div className="connection-status">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <div className="status-light"></div>
          <span>{isConnected ? '● LIVE' : '○ OFFLINE'}</span>
        </div>
        <span className="timestamp">
          Last updated: {new Date(currentData.timestamp || Date.now()).toLocaleTimeString()}
        </span>
      </div>

      <div className="obd-grid">
        {/* Speed Gauge */}
        <div className="obd-gauge">
          <div className="gauge-header">
            <span className="gauge-icon">🚗</span>
            <h3>Speed</h3>
          </div>
          <div className="gauge-value">
            <span className="value">{currentData.speed?.value || 0}</span>
            <span className="unit">{currentData.speed?.unit || 'km/h'}</span>
          </div>
          <div className="gauge-meter">
            <div 
              className="meter-fill" 
              style={{ width: `${Math.min((currentData.speed?.value || 0) / 200 * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* RPM Gauge */}
        <div className="obd-gauge">
          <div className="gauge-header">
            <span className="gauge-icon">⚡</span>
            <h3>RPM</h3>
          </div>
          <div className="gauge-value">
            <span className="value">{Math.round(currentData.rpm?.value || 0)}</span>
            <span className="unit">{currentData.rpm?.unit || 'rpm'}</span>
          </div>
          <div className="gauge-meter">
            <div 
              className="meter-fill" 
              style={{ width: `${Math.min((currentData.rpm?.value || 0) / 8000 * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Temperature Gauge */}
        <div className="obd-gauge">
          <div className="gauge-header">
            <span className="gauge-icon">🌡️</span>
            <h3>Engine Temp</h3>
          </div>
          <div className="gauge-value">
            <span className="value">{currentData.temperature?.value || 0}</span>
            <span className="unit">{currentData.temperature?.unit || '°C'}</span>
          </div>
          <div className="gauge-meter">
            <div 
              className="meter-fill temperature" 
              style={{ width: `${Math.min((currentData.temperature?.value || 0) / 120 * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Fuel Gauge */}
        <div className="obd-gauge">
          <div className="gauge-header">
            <span className="gauge-icon">⛽</span>
            <h3>Fuel Level</h3>
          </div>
          <div className="gauge-value">
            <span className="value">{currentData.fuel?.value || 0}</span>
            <span className="unit">{currentData.fuel?.unit || '%'}</span>
          </div>
          <div className="gauge-meter">
            <div 
              className="meter-fill fuel" 
              style={{ width: `${currentData.fuel?.value || 0}%` }}
            ></div>
          </div>
          {currentData.fuel?.value < 20 && (
            <div className="low-fuel-warning">⚠️ Low Fuel</div>
          )}
        </div>

        {/* Additional Data Cards */}
        <div className="data-cards">
          <div className="data-card">
            <span className="card-icon">🔧</span>
            <div className="card-content">
              <div className="card-title">Engine Load</div>
              <div className="card-value">{currentData.engine_load?.value || 0}%</div>
            </div>
          </div>
          
          <div className="data-card">
            <span className="card-icon">🎚️</span>
            <div className="card-content">
              <div className="card-title">Throttle</div>
              <div className="card-value">{currentData.throttle?.value || 0}%</div>
            </div>
          </div>
          
          {currentData.battery && (
            <div className="data-card">
              <span className="card-icon">🔋</span>
              <div className="card-content">
                <div className="card-title">Battery</div>
                <div className="card-value">{currentData.battery.value}V</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OBDMonitor