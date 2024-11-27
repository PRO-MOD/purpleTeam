
from pymodbus.client import ModbusTcpClient
import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_sock import Sock
import threading
import json
import time

# Initialize Modbus TCP client
modbus_client = ModbusTcpClient('localhost', port=502)

# Flask app and WebSocket setup
app = Flask(__name__)
sock = Sock(app)
connected_clients = []

# Store previous Modbus data for change detection
previous_data = None

# Connect to the Modbus server
modbus_client.connect()

@app.route('/')
def index():
    return "WebSocket Server Running"

@sock.route('/ws')
def websocket(ws):
    global previous_data
    
    # When a WebSocket client connects, send a flag and initial Modbus values
    if previous_data is not None:
        # Send initial flag message and Modbus values
        initial_message = json.dumps({"message": "Flag", "registers": previous_data})
        ws.send(initial_message)
        print(f"Flag and initial values sent to Unity: {initial_message}")
    
    # Add the client to the list of connected clients
    connected_clients.append(ws)
    try:
        while True:
            data = ws.receive()
            if data is None:
                break
            print(f"Received from Unity: {data}")
    finally:
        connected_clients.remove(ws)

def send_modbus_data():
    global previous_data
    
    while True:
        # Read 5 holding registers from Modbus starting at address 0
        registers = modbus_client.read_holding_registers(0, 5)
        
        if not registers.isError():
            current_data = registers.registers  # Read the registers as a list of values
            
            # Print the received Modbus values for understanding
            print(f"Modbus values received: {current_data}")
            
            # If the data has changed, send it to connected WebSocket clients
            if current_data != previous_data:
                print(f"Updated values (sent to Unity): {current_data}")
                
                # Construct message with Modbus values
                message = json.dumps({"registers": current_data})
                
                # Send message to all connected WebSocket clients
                for ws in connected_clients[:]:
                    try:
                        ws.send(message)
                    except Exception as e:
                        print(f"Error sending to a client: {e}")
                        connected_clients.remove(ws)
                
                # Update previous data with the new values
                previous_data = current_data
                print(f"Updated Modbus values sent: {current_data}")
        
        # Sleep for a second before the next read
        time.sleep(60)

if __name__ == '__main__':
    # Start the Modbus reading and WebSocket sending in a separate thread
    modbus_thread = threading.Thread(target=send_modbus_data)
    modbus_thread.daemon = True
    modbus_thread.start()
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000, debug=False)
