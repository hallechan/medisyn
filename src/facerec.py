facerec.py
# facerec_emotion_redness_fixed.py
import cv2
import numpy as np
from deepface import DeepFace

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Cannot open webcam")
    exit()

frame_count = 0
dominant_emotion = "Detecting..."

# Haar cascade for face detection (for redness only)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    frame_count += 1

    # ---------------- Emotion detection every 5 frames ----------------
    if frame_count % 5 == 0:
        try:
            result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            dominant_emotion = result[0]["dominant_emotion"]
        except Exception:
            dominant_emotion = "No face detected"

    # ---------------- Redness detection ----------------
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    for (x, y, w, h) in faces:
        face_crop = frame[y:y+h, x:x+w]

        # Convert to HSV for skin/redness detection
        hsv = cv2.cvtColor(face_crop, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, np.array([0,20,70]), np.array([20,255,255]))

        r_channel = face_crop[:,:,2]
        skin_pixels = r_channel[mask>0]
        redness = int(np.mean(skin_pixels)) if len(skin_pixels) > 0 else 0

        # Overlay redness
        cv2.putText(frame, f"Redness: {redness}", (x, y+h+25),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,0,255), 2)
        # Optional: draw rectangle
        cv2.rectangle(frame, (x,y), (x+w, y+h), (255,0,0), 2)

    # ---------------- Overlay emotion ----------------
    cv2.putText(frame, f"Emotion: {dominant_emotion}", (50, 50), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # show webcam
    cv2.imshow("Emotion + Redness Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

