# 🏥 How to Demo MinuteZero

MinuteZero is designed to be a high-impact, zero-latency medical AI demo. Follow this script to showcase the multimodal power of Gemini 1.5 Pro and full compliance with the hackathon's Google Cloud/SDK requirements.

## 🛠️ Step 1: Preparation
1.  **Backend Check**: Ensure your local agent is running (`python agent.py dev`).
2.  **Visuals**: Have a "patient" (friend, mannequin, or your own arm) ready.
3.  **GCP Compliance**: Ensure you've run `setup_gcp_compliance.bat` so your `GOOGLE_CLOUD_PROJECT` is set.

## 🎬 The Demo Walkthrough

### 1. The Opening (0:00 - 0:30)
- **Visual**: Landing page on a phone or laptop.
- **Script**: "MinuteZero uses the Gemini 1.5 Pro Multimodal Live API to bridge the 'Panic Gap' between an emergency and the arrival of help."

### 2. The Rapid Response & Google Cloud Triage (0:30 - 1:00)
- **Action**: Tap the **"Heavy Bleeding"** Rapid Protocol button.
- **User**: "Where is the nearest trauma center?"
- **Agent**: (Calls the **Google Maps Places API**) "MinuteZero is routing you. The nearest Level 1 Trauma Center is Memorial Hermann - Texas Medical Center. ETA is 6 minutes."
- **Script**: "MZ is built with **Google Cloud Services**. It automatically triages the emergency to specify the correct facility—trauma, pediatric, or cardiac—using real-time Google Maps data."

### 3. The Multimodal "Vision" (1:00 - 2:00) - THE CLIMAX
- **Action**: Point your camera at your "wound".
- **User**: "I'm applying pressure, what next?"
- **Agent**: (Gemini sees the camera feed) "I see the arterial bleed. You need more leverage. Use a cloth and wrap it 2 inches above the wound. Apply the tourniquet now."
- **Script**: "Gemini isn't just listening; it's *watching*. It understands the physical environment and provides spatially-aware instructions via the Multimodal Live API."

### 4. The Final Synthesis & Clinical Sync (2:00 - 2:30)
- **Action**: Tap "End Call".
- **Visual**: Show the console or a "Syncing..." UI element.
- **Script**: "Once the call ends, MinuteZero uses the **Gemini GenAI SDK** and **Vertex AI** to synthesize a clinical briefing and sync it directly to **Google Cloud Storage**. This ensures that the hospital has a complete record before the patient even arrives."

---
## 🛡️ Eligibility Proof Points (For Judges)
When recording, mention or show:
1.  **GCP Maps**: Live routing via Google Cloud Services.
2.  **GenAI SDK**: Post-session clinical synthesis via `google-generativeai`.
3.  **Vertex AI**: High-fidelity medical review powered by Google Cloud's AI Platform.
