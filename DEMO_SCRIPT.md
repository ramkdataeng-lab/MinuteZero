# 🏥 How to Demo MinuteZero

MinuteZero is designed to be a high-impact, zero-latency medical AI demo. Follow this script to showcase the multimodal power of Gemini 1.5 Pro.

## 🛠️ Step 1: Preparation
1.  **Backend Check**: Ensure your local agent is running (`python agent.py dev`).
2.  **Visuals**: Have a "patient" (friend, mannequin, or even just your own arm/leg) ready. For a "Heavy Bleeding" demo, a red marker or mock wound works great.
3.  **Environment**: Silent room is best for voice interaction, but Gemini handles noise well.

## 🎬 The Demo Walkthrough

### 1. The Opening (0:00 - 0:30)
- **Visual**: Landing page on a phone or laptop.
- **Action**: Point to the "MinuteZero" logo.
- **Script**: "This is MinuteZero. In a medical emergency, you're usually waiting 10 minutes for an ambulance. Those 10 minutes—the Panic Gap—are when lives are lost. We use Gemini 1.5 Pro to provide a first responder who can see, hear, and help *instantly*."

### 2. The Rapid Response (0:30 - 1:00)
- **Action**: Tap the **"Heavy Bleeding"** Rapid Protocol button.
- **Visual**: Watch the "Connecting..." loader transition into the active HUD.
- **Wait**: The AI agent will speak FIRST.
- **Agent**: "MinuteZero connected. I understand there is a heavy bleeding emergency. Keep your camera on the wound. Start applying firm pressure now."
- **Script**: "Notice I didn't have to explain the situation. The one-tap protocol informed the AI immediately, saving critical seconds."

### 3. The Multimodal "Vision" (1:00 - 2:00) - THE CLIMAX
- **Action**: Point your camera at your "wound".
- **User**: "I'm applying pressure, what next?"
- **Agent**: (Gemini will see the camera feed) "I see where you're holding. You need more leverage. Use a cloth if you have one and wrap it tightly above the wound."
- **Script**: "Gemini isn't just listening; it's *watching*. It understands the physical environment and provides spatially-aware instructions."

### 4. The Exit (2:00 - 2:30)
- **Action**: Tap "End Call".
- **Script**: "MinuteZero turns every bystander into a lifesaver. No queues, no panic, just the Golden Minute handled by AI."

---

## 💡 Troubleshooting the Demo
- **"Nothing happens when I click"**: 
    - Open Chrome DevTools (`F12` -> Console). Look for "Failed to generate token".
    - Likely cause: `LIVEKIT_URL` or `API_KEY` is missing in your environment.
- **Agent doesn't speak**:
    - Ensure your backend `python agent.py dev` shows `registered worker`.
    - Make sure you aren't muted.
- **Vision is slow**:
    - Ensure you have good upload speed. Multimodal feeds require consistent bandwidth.
