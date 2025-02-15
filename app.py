import csv
import time
import threading
from datetime import datetime, timezone
from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import mindwave

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

socketio = SocketIO(app, cors_allowed_origins=["http://localhost:5173", "http://127.0.0.1:5173"])

fs = 100
T = 1 / fs

session_name = "default_session"
ts = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')
filename = f'recordings/{session_name}_{ts}.dat'

headset = mindwave.Headset('/dev/tty.MindWaveMobile')

recording = False

def record_data():
    global recording
    start_time = time.time()
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Timestamp', 'Raw', 'Attention', 'Meditation', 'delta', 'theta', 'low-alpha', 'high-alpha', 'low-beta', 'high-beta', 'low-gamma', 'mid-gamma'])
        while recording:
            elapsed_seconds = time.time() - start_time
            values = list(headset.waves.values())
            values = [elapsed_seconds, headset.raw_value, headset.attention, headset.meditation] + values
            writer.writerow(values)
            socketio.emit('new_data', {'Timestamp': elapsed_seconds, 'Raw': headset.raw_value, 'Attention': headset.attention, 'Meditation': headset.meditation, **headset.waves})
            time.sleep(T)

@app.route('/start', methods=['GET'])
def start_recording():
    global recording
    recording = True
    threading.Thread(target=record_data).start()
    return jsonify({"message": "Recording started"})

@app.route('/stop', methods=['GET'])
def stop_recording():
    global recording
    recording = False
    return jsonify({"message": "Recording stopped"})

if __name__ == '__main__':
    socketio.run(app, host="localhost", port=8080, debug=True)