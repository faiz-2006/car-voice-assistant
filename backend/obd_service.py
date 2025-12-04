# Placeholder for obd_service.py
import obd
from datetime import datetime
import time
from typing import Dict, Any, Optional
from config import config

class OBDService:
    def __init__(self):
        self.connection = None
        self.last_data = {}
        self.is_connected = False
        self.connect()
    
    def connect(self):
        """Connect to OBD-II adapter"""
        try:
            print(f"Connecting to OBD at {config.OBD_PORT}...")
            self.connection = obd.OBD(portstr=config.OBD_PORT, baudrate=config.OBD_BAUDRATE)
            self.is_connected = self.connection.is_connected()
            if self.is_connected:
                print("✅ OBD Connected Successfully")
            else:
                print("❌ OBD Connection Failed")
        except Exception as e:
            print(f"❌ OBD Connection Error: {e}")
            self.is_connected = False
    
    def get_all_data(self) -> Dict[str, Any]:
        """Get all available OBD data"""
        if not self.is_connected:
            return {"error": "OBD not connected", "connected": False}
        
        data = {
            "connected": True,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            # Speed
            speed_cmd = obd.commands.SPEED
            speed = self.connection.query(speed_cmd)
            data["speed"] = {
                "value": speed.value.magnitude if speed.value else 0,
                "unit": str(speed.unit) if speed.unit else "km/h"
            }
            
            # RPM
            rpm_cmd = obd.commands.RPM
            rpm = self.connection.query(rpm_cmd)
            data["rpm"] = {
                "value": rpm.value.magnitude if rpm.value else 0,
                "unit": "rpm"
            }
            
            # Engine Temperature
            temp_cmd = obd.commands.COOLANT_TEMP
            temp = self.connection.query(temp_cmd)
            data["temperature"] = {
                "value": temp.value.magnitude if temp.value else 0,
                "unit": str(temp.unit) if temp.unit else "°C"
            }
            
            # Fuel Level
            fuel_cmd = obd.commands.FUEL_LEVEL
            fuel = self.connection.query(fuel_cmd)
            data["fuel"] = {
                "value": fuel.value.magnitude if fuel.value else 0,
                "unit": "%"
            }
            
            # Engine Load
            load_cmd = obd.commands.ENGINE_LOAD
            load = self.connection.query(load_cmd)
            data["engine_load"] = {
                "value": load.value.magnitude if load.value else 0,
                "unit": "%"
            }
            
            # Throttle Position
            throttle_cmd = obd.commands.THROTTLE_POS
            throttle = self.connection.query(throttle_cmd)
            data["throttle"] = {
                "value": throttle.value.magnitude if throttle.value else 0,
                "unit": "%"
            }
            
            self.last_data = data
            
        except Exception as e:
            data["error"] = str(e)
        
        return data
    
    def get_specific_data(self, parameter: str) -> Dict[str, Any]:
        """Get specific OBD parameter"""
        commands = {
            "speed": obd.commands.SPEED,
            "rpm": obd.commands.RPM,
            "temperature": obd.commands.COOLANT_TEMP,
            "fuel": obd.commands.FUEL_LEVEL,
            "engine_load": obd.commands.ENGINE_LOAD,
            "throttle": obd.commands.THROTTLE_POS,
            "battery": obd.commands.CONTROL_MODULE_VOLTAGE
        }
        
        if parameter not in commands:
            return {"error": f"Unknown parameter: {parameter}"}
        
        if not self.is_connected:
            return {"error": "OBD not connected", "connected": False}
        
        try:
            response = self.connection.query(commands[parameter])
            return {
                "value": response.value.magnitude if response.value else 0,
                "unit": str(response.unit) if response.unit else "",
                "connected": True
            }
        except Exception as e:
            return {"error": str(e), "connected": False}

# Global OBD service instance
obd_service = OBDService()