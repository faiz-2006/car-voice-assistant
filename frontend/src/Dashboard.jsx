import React from 'react'
import OBDMonitor from './OBDMonitor'
import VoiceAssistant from './VoiceAssistant'

const Dashboard = ({ obdData, onVoiceCommand, onVoiceResponse }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        {/* Vehicle Metrics Section */}
        <div className="metrics-section">
          <h2>Vehicle Metrics</h2>
          <div className="metrics-grid">
            <MetricCard 
              title="Speed" 
              value={obdData?.speed?.value || 0} 
              unit={obdData?.speed?.unit || 'km/h'}
              color="#3B82F6"
            />
            <MetricCard 
              title="RPM" 
              value={obdData?.rpm?.value || 0} 
              unit={obdData?.rpm?.unit || 'rpm'}
              color="#EF4444"
            />
            <MetricCard 
              title="Engine Temp" 
              value={obdData?.temperature?.value || 0} 
              unit={obdData?.temperature?.unit || '°C'}
              color="#F59E0B"
            />
            <MetricCard 
              title="Fuel Level" 
              value={obdData?.fuel?.value || 0} 
              unit={obdData?.fuel?.unit || '%'}
              color="#10B981"
            />
            <MetricCard 
              title="Engine Load" 
              value={obdData?.engine_load?.value || 0} 
              unit={obdData?.engine_load?.unit || '%'}
              color="#8B5CF6"
            />
            <MetricCard 
              title="Throttle" 
              value={obdData?.throttle?.value || 0} 
              unit={obdData?.throttle?.unit || '%'}
              color="#EC4899"
            />
          </div>
        </div>

        {/* Voice Assistant Section */}
        <div className="voice-section">
          <VoiceAssistant 
            onCommand={onVoiceCommand}
            onResponse={onVoiceResponse}
          />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => onVoiceCommand?.('car status')}>
              <span className="action-icon">🚗</span>
              <span>Car Status</span>
            </button>
            <button className="action-btn" onClick={() => onVoiceCommand?.('check speed')}>
              <span className="action-icon">📊</span>
              <span>Check Speed</span>
            </button>
            <button className="action-btn" onClick={() => onVoiceCommand?.('fuel level')}>
              <span className="action-icon">⛽</span>
              <span>Fuel Level</span>
            </button>
            <button className="action-btn" onClick={() => onVoiceCommand?.('engine temperature')}>
              <span className="action-icon">🌡️</span>
              <span>Engine Temp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const MetricCard = ({ title, value, unit, color }) => (
  <div className="metric-card" style={{ borderLeftColor: color }}>
    <div className="metric-header">
      <h3>{title}</h3>
      <div className="metric-value">
        <span className="value">{value.toFixed(1)}</span>
        <span className="unit">{unit}</span>
      </div>
    </div>
    <div className="metric-progress">
      <div 
        className="progress-bar" 
        style={{ 
          width: `${Math.min(value, 100)}%`, 
          backgroundColor: color 
        }}
      ></div>
    </div>
  </div>
)

export default Dashboard