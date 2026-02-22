# MinuteZero Demo Video Script (4-Minute Target)

## 🕒 Phase 1: The Problem (0:00 - 0:45)
- **Visual**: Background b-roll of someone in distress (hands shaking, trying to call 911).
- **Narration**: "In a medical emergency, the biggest killer isn't the injury—it's the Panic Gap. Those 10 minutes while you wait for an ambulance where you don't know what to do. Traditional help is too slow. Telehealth has a queue. You need someone who can see and help, right now."

## 🕒 Phase 2: The Solution (0:45 - 1:15)
- **Visual**: Show the MinuteZero UI. The user taps the "Pulse" button.
- **Action**: The agent connects instantly. 
- **Agent**: "MinuteZero connected. I am watching. What is the emergency?"
- **Narration**: "Meet MinuteZero. Powered by Gemini 1.5 Pro Multimodal Live API, it provides zero-latency guidance during the Golden Minute."

## 🕒 Phase 3: The "Magic" Moment (1:15 - 2:30)
- **Visual**: Split screen. One side is the User Camera (showing a mock wound or a CPR mannequin). The other is the Agent's audio waveform.
- **Demo Sequence**:
    1. **User**: "He's bleeding from his leg!"
    2. **Agent (Vision)**: "I see the laceration on the left thigh. Apply firm pressure. I'm highlighting the spot on your screen." (Note: Mention this as a future AR feature if not implemented).
    3. **Action**: User starts CPR.
    4. **Agent (Audio/Vision Sync)**: "Good rhythm. Stay with my count. One... two... three... four..." (Agent's voice matches the user's action).

## 🕒 Phase 4: Technical Depth (2:30 - 3:30)
- **Visual**: Architecture diagram and snippets of `agent.py`.
- **Narration**: "Under the hood, we use LiveKit for ultra-low latency WebRTC streaming. We process interleaved audio and video tokens directly through Gemini 1.5 Pro's multimodal live window, allowing for sub-200ms response times."

## 🕒 Phase 5: The Impact (3:30 - 4:00)
- **Visual**: The user looking relieved as the "Ambulance Arriving" indicator appears.
- **Narration**: "MinuteZero doesn't replace doctors. It eliminates panic. It saves the minutes that save lives. Built for the Gemini Live Agent Challenge."

---

## 💡 Filming Tips:
1. **Lighting**: Ensure the "injury" area is well-lit so Gemini's vision capability is clear in the recording.
2. **Audio**: Use a good mic for the Agent's voice; it should sound calm and synthesized but authoritative.
3. **Pacing**: Don't rush. Let the agent's response time shine—that low latency is your winning feature.
