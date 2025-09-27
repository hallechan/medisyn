# STRUCTURE OF WORKFLOW
[Webcam (React Frontend)]
        │
        ▼
[Frame Capture & Preprocessing]
        │
        ▼
[Backend CV Module (Python / Node)]
   - Face detection & landmarks (Mediapipe / OpenCV)
   - Mood recognition (FER / DeepFace)
      - Take snapshot of user's face and have an analysis of where the red spots and pimples are (e.g. acne scars or pimples)
   - Redness/sweat detection (HSV / LAB analysis)
        │
        ▼
[Descriptor Output]
   Example: { mood: "sad", eyeRedness: 0.7, noseRedness: 0.5, sweat: true }
        │
        ▼
[Gemini AI API]
   - Input: descriptor + user message
   - Output: context-aware response
        │
        ▼
[Frontend Display]
   - Chatbot / UI response
