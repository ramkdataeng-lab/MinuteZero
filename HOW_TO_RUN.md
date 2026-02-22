# 🏥 MinuteZero: Execution Guide

Follow these steps to get the Gemini Live Agent up and running.

## 1. Prerequisites
- **LiveKit Cloud**: Sign up for a free project at [cloud.livekit.io](https://cloud.livekit.io).
- **Google AI Studio Key**: Get your Gemini API key from [aistudio.google.com](https://aistudio.google.com).

## 2. Environment Setup

### Frontend (`resq-web`)
Create/Update `resq-web/.env.local`:
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

### Backend (`resq-agent`)
Create/Update `resq-agent/.env`:
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
GOOGLE_API_KEY=your-gemini-api-key
```

## 3. Running the Application

### Step A: Start the Backend Agent
Open a terminal in the `resq-agent` folder:
```powershell
pip install -r requirements.txt
python agent.py dev
```
*The agent is now listening for job requests from LiveKit.*

### Step B: Start the Frontend
Open a NEW terminal in the `resq-web` folder:
```powershell
npm run dev
```

### Step C: Test the Connection
1. Open [http://localhost:3000](http://localhost:3000).
2. Click the **"Initialize Protocol"** pulse button.
3. Grant camera and microphone permissions.
4. **Speak**: "I have an emergency, someone is bleeding!"
5. **Watch**: The Gemini agent will respond in real-time.

## 🏆 Hackathon Pro-Tip
For the demo video, ensure your room is well-lit. When you act out the emergency, show the agent what's happening via your camera—Gemini 1.5 Pro's vision is your biggest technical differentiator!
