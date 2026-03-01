
import asyncio
import edge_tts
import os

# Select Voice: "en-US-ChristopherNeural" is dramatic and authoritative
VOICE = "en-US-ChristopherNeural"
OUTPUT_DIR = "voiceovers"

SCRIPT = {
    "01_Intro_Panic_Gap": "In a medical emergency, you don't have minutes. You have seconds. We call it the Panic Gap—a void where fear paralyzes and help is too far away.",
    "02_The_Solution": "Meet MinuteZero. We’ve bridged that gap using the most advanced AI on the planet: Gemini 1.5 Pro. This isn't just a chatbot—this is a Live Agent that integrates audio, video, and medical protocols into a single, zero-latency feedback loop.",
    "03_Multimodal": "By leveraging the Gemini Multimodal Live API, MinuteZero doesn't just listen. It sees the world. It processes interleaved video and audio tokens in real-time, providing vision-aware guidance when every heart beat counts.",
    "04_Zero_Latency": "Using a high-performance WebRTC bridge via LiveKit, we achieve near-human latency, ensuring that the critical instructions you need are delivered at the speed of thought. This is survival, handled by AI.",

    # PHASE 2: APPLICATION START (REMOVING LOGIN AS REQUESTED)
    "05_Dashboard_Overview": "Welcome to the MinuteZero command center. Here, AI protocols are ready for instant deployment. No login delays, no friction—every second counts.",
    "06_Select_Bleeding": "We begin with a critical arterial injury. Notice how Gemini 1.5 Pro instantly analyzes the high-resolution stream.",
    
    # PHASE 3: BLEEDING SCENARIO + DIAGNOSTICS
    "07_Live_Diagnostics": "Observe the HUD. The AI isn't just seeing blood—it's identifying the Brachial artery, estimating volume loss, and dynamically compiling a hospital prep-list in real-time.",
    "08_Bleeding_Instruction": "The agent provides calm, precise instructions, guiding the user to apply high-pressure manual occlusion exactly where the AI detects the most significant flow.",

    # PHASE 4: CHILD CHOKING SCENARIO
    "09_Child_Choking": "Next, a pediatric nightmare: child choking. MinuteZero switches context instantly. It visually guides the rescuer through life-saving back blows and chest thrusts.",
    "10_Choking_Guidance": "The multimodal vision detects the child's posture and provides real-time adjustments to ensure the maneuver is performed safely and effectively.",

    # PHASE 5: DOCTOR NOTES & GOOGLE DRIVE
    "11_Clinical_Briefing": "The emergency is stabilized. But the Golden Minute doesn't end here. MinuteZero automatically generates a comprehensive clinical briefing for the trauma center.",
    "12_Google_Drive": "With one tap, these notes are synced to Google Drive. The hospital receives every detail—vitals, blood loss, and prep-lists—before the ambulance even arrives.",
    "13_Time_Saved": "This pre-routing of the patient directly to the trauma specialist saves an average of 14 minutes in hospital intake. Seconds saved in the field, minutes saved in the ward. This is MinuteZero.",

    # PHASE 6: THE FUTURE
    "14_Future_Closing": "MinuteZero turns every bystander into a lifesaver. We’ve combined strict AHA protocol adherence with a premium mobile-first interface. Impact. Technical Depth. Innovation.",
    "15_Final_Tagline": "This is the Golden Minute, handled by Gemini. This is MinuteZero. Survive the Gap."
}

async def generate_audio():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    # Generate an extra intro/outro for the cinematic feel
    print(f"[GENERATING] {len(SCRIPT)} audio files for the cinematic script...")
    
    for filename, text in SCRIPT.items():
        output_file = os.path.join(OUTPUT_DIR, f"{filename}.mp3")
        # Adding a bit of rate/pitch adjustment for drama if needed, but Christopher is already good
        communicate = edge_tts.Communicate(text, VOICE)
        await communicate.save(output_file)
        print(f"[SAVED]: {output_file}")
        
    print(f"\n[DONE] All cinematic voiceovers generated in '{OUTPUT_DIR}/' folder!")

if __name__ == "__main__":
    asyncio.run(generate_audio())
