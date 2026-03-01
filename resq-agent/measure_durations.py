
import os
from pydub import AudioSegment

VOICE_DIR = "voiceovers"
files = [
    "01_Intro_Panic_Gap.mp3", "02_The_Solution.mp3", "03_The_Multimodal.mp3", "04_Zero_Latency.mp3",
    "05_Auth_Secure.mp3", "06_Personalization.mp3", "07_Demo_Start.mp3", "08_AI_Response.mp3",
    "09_Technical_Execution.mp3", "10_Future_Closing.mp3", "11_Final_Tagline.mp3"
]

# Note: The keys might slightly differ in generate_voiceover.py, checking the list dir...
actual_files = [f for f in os.listdir(VOICE_DIR) if f.endswith(".mp3")]
actual_files.sort()

print("DURATIONS = {")
for f in actual_files:
    audio = AudioSegment.from_file(os.path.join(VOICE_DIR, f))
    duration_sec = len(audio) / 1000.0
    print(f'    "{f.replace(".mp3", "")}": {duration_sec:.2f},')
print("}")
