# backend/facerec_ws.py
import cv2
import numpy as np
import asyncio
import websockets
import json
from deepface import DeepFace
import base64
import traceback
from concurrent.futures import ThreadPoolExecutor

cap = cv2.VideoCapture(0)
use_mock_data = False
if not cap.isOpened():
    print("Cannot open webcam - using mock data for testing")
    use_mock_data = True

frame_count = 0
dominant_emotion = "Detecting..."
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

executor = ThreadPoolExecutor(max_workers=1)

def analyze_emotion(frame):
    global dominant_emotion
    try:
        rgb_frame = cv2.cvtColor(cv2.resize(frame, (640, 480)), cv2.COLOR_BGR2RGB)
        result = DeepFace.analyze(rgb_frame, actions=['emotion'], enforce_detection=False)
        dominant_emotion = result[0]["dominant_emotion"]
    except Exception as e:
        print("DeepFace error:", e)
        traceback.print_exc()
        dominant_emotion = "No face detected"

def get_frame_analysis(frame):
    # Redness detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    redness = 0
    for (x, y, w, h) in faces:
        face_crop = frame[y:y+h, x:x+w]
        hsv = cv2.cvtColor(face_crop, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, np.array([0,20,70]), np.array([20,255,255]))
        r_channel = face_crop[:,:,2]
        skin_pixels = r_channel[mask>0]
        redness = float(np.mean(skin_pixels)) if len(skin_pixels) > 0 else 0
        break  # only first face

    # Encode frame as JPEG + base64
    _, buffer = cv2.imencode('.jpg', frame)
    jpg_as_text = base64.b64encode(buffer).decode('utf-8')

    return {"emotion": dominant_emotion, "redness": redness, "frame": jpg_as_text}

async def cv_stream(websocket):
    global frame_count, dominant_emotion
    while True:
        try:
            if use_mock_data:
                # Generate mock data for testing
                frame_count += 1
                import random
                import math

                # Mock redness with some variation
                redness = 50 + 20 * math.sin(frame_count * 0.1) + random.uniform(-5, 5)
                redness = max(0, min(255, redness))

                # Mock emotions that cycle through
                emotions = ["happy", "neutral", "surprised", "sad", "angry"]
                dominant_emotion = emotions[frame_count % len(emotions)]

                # Create a simple mock frame (black image)
                mock_frame = np.zeros((480, 640, 3), dtype=np.uint8)
                _, buffer = cv2.imencode('.jpg', mock_frame)
                jpg_as_text = base64.b64encode(buffer).decode('utf-8')

                data = {"emotion": dominant_emotion, "redness": redness, "frame": jpg_as_text}
                await websocket.send(json.dumps(data))
                await asyncio.sleep(0.1)  # 10 fps for mock data
            else:
                ret, frame = cap.read()
                if not ret:
                    continue

                frame_count += 1

                # Emotion detection every 10 frames (threaded)
                if frame_count % 10 == 0:
                    executor.submit(analyze_emotion, frame.copy())

                data = get_frame_analysis(frame)
                await websocket.send(json.dumps(data))
                await asyncio.sleep(0.05)  # ~20 fps
        except Exception as e:
            print("Error in websocket stream:", e)
            traceback.print_exc()
            await asyncio.sleep(0.1)

async def main():
    async with websockets.serve(cv_stream, "localhost", 8765):
        print("WebSocket server running on ws://localhost:8765")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
