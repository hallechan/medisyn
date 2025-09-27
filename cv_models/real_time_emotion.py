import cv2
from src.fer.fer import FER

cap = cv2.VideoCapture(0)
detector = FER(mtcnn=True)  # or mtcnn=False if you prefer

while True:
    ret, frame = cap.read()
    if not ret:
        break

    faces = detector.detect_emotions(frame)
    for face in faces:
        (x, y, w, h) = face["box"]
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
        top_emotion, score = max(face["emotions"].items(), key=lambda i: i[1])
        cv2.putText(frame, f"{top_emotion} ({score:.2f})", (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

    cv2.imshow("Emotion Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()