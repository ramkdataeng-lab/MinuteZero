
import os
from mutagen.mp3 import MP3

VOICE_DIR = "voiceovers"
actual_files = [f for f in os.listdir(VOICE_DIR) if f.endswith(".mp3")]
actual_files.sort()

print("DURATIONS = {")
for f in actual_files:
    audio = MP3(os.path.join(VOICE_DIR, f))
    duration_sec = audio.info.length
    print(f'    "{f.replace(".mp3", "")}": {duration_sec:.2f},')
print("}")
