import asyncio
import os
import time
from playwright.async_api import async_playwright
from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_audioclips

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VOICEOVER_DIR = os.path.join(BASE_DIR, "voiceovers")
OUTPUT_VIDEO = "MinuteZero_Final_Demo.mp4"

# Image paths (local slides folder)
SLIDES = [
    os.path.join(BASE_DIR, "slides", "slide1.png"),
    os.path.join(BASE_DIR, "slides", "slide2.png"),
    os.path.join(BASE_DIR, "slides", "slide3.png"),
    os.path.join(BASE_DIR, "slides", "slide4.png")
]

# Precise Durations from mutagen
DURATIONS = {
    "01_Intro_Panic_Gap": 11.30,
    "02_The_Solution": 18.22,
    "03_Multimodal": 15.70,
    "04_Zero_Latency": 13.18,
    "05_Dashboard_Overview": 11.81,
    "06_Select_Bleeding": 9.19,
    "07_Live_Diagnostics": 12.22,
    "08_Bleeding_Instruction": 10.06,
    "09_Child_Choking": 12.53,
    "10_Choking_Guidance": 8.40,
    "11_Clinical_Briefing": 11.21,
    "12_Google_Drive": 12.12,
    "13_Time_Saved": 12.96,
    "14_Future_Closing": 14.83,
    "15_Final_Tagline": 7.66
}

async def record_browser():
    async with async_playwright() as p:
        # Standard 1080p 16:9 aspect ratio
        width, height = 1920, 1080
        
        # Use browser window instead of --app to ensure we can see navigation and scaling
        browser = await p.chromium.launch(
            args=[f"--window-size={width},{height}", "--start-maximized"],
            headless=False
        )
        
        context = await browser.new_context(
            record_video_dir=".",
            record_video_size={"width": width, "height": height},
            viewport={"width": width, "height": height}
        )
        page = await context.new_page()

        # PHASE 1: Full-Screen Slides
        intro_keys = ["01_Intro_Panic_Gap", "02_The_Solution", "03_Multimodal", "04_Zero_Latency"]
        for i, slide_path in enumerate(SLIDES):
            print(f"Showing Slide {i+1}...")
            with open(slide_path, "rb") as f:
                import base64
                b64 = base64.b64encode(f.read()).decode()
            
            await page.set_content(f"""
                <style>
                    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
                    body {{ background: black; width: {width}px; height: {height}px; overflow: hidden; display: flex; align-items: center; justify-content: center; }}
                    img {{ max-width: 100%; max-height: 100%; object-fit: contain; }}
                    @keyframes pulse {{ 0% {{ opacity: 0.1; }} 50% {{ opacity: 0.2; }} 100% {{ opacity: 0.1; }} }}
                    .heartbeat {{ position: fixed; bottom: 40px; right: 40px; width: 14px; height: 14px; background: #ff3b30; border-radius: 50%; animation: pulse 1.5s infinite; }}
                </style>
                <body><img src="data:image/png;base64,{b64}"><div class="heartbeat"></div></body>
            """)
            await page.wait_for_timeout(DURATIONS[intro_keys[i]] * 1000)

        # PHASE 2: Application Dashboard
        print("Opening Dashboard...")
        await page.goto("http://localhost:3000")
        await page.wait_for_load_state("networkidle")
        # Removing login as requested, we start at the hub
        await page.wait_for_timeout(DURATIONS["05_Dashboard_Overview"] * 1000)

        # PHASE 3: Heavy Bleeding & Live Diagnostics
        print("Triggering Heavy Bleeding Protocol...")
        await page.locator("button:has-text('Heavy Bleeding')").click()
        # 06_Select_Bleeding
        await page.wait_for_timeout(DURATIONS["06_Select_Bleeding"] * 1000)
        # 07_Live_Diagnostics
        await page.wait_for_timeout(DURATIONS["07_Live_Diagnostics"] * 1000)
        # 08_Bleeding_Instruction
        await page.wait_for_timeout(DURATIONS["08_Bleeding_Instruction"] * 1000)
        
        # End Session
        print("Ending Bleeding Session...")
        await page.locator("button:has-text('END EMERGENCY SESSION')").click()
        
        # PHASE 4: Clinical Briefing & Google Drive
        print("Generating Doctor Notes / Syncing to Drive...")
        await page.wait_for_timeout(DURATIONS["11_Clinical_Briefing"] * 1000)
        
        # Click Sync to Drive
        await page.locator("button:has-text('SYNC CLINICAL NOTES')").click()
        await page.wait_for_timeout(DURATIONS["12_Google_Drive"] * 1000)
        await page.wait_for_timeout(DURATIONS["13_Time_Saved"] * 1000)
        
        # Close Briefing (Syncing does this automatically in the UI)
        await page.wait_for_load_state("networkidle")

        # PHASE 5: Child Choking
        print("Triggering Child Choking Scenario...")
        await page.locator("button:has-text('Child Choking')").click()
        await page.wait_for_timeout(DURATIONS["09_Child_Choking"] * 1000)
        await page.wait_for_timeout(DURATIONS["10_Choking_Guidance"] * 1000)
        
        # End Session
        await page.locator("button:has-text('END EMERGENCY SESSION')").click()
        
        # PHASE 6: Future Closing
        print("Final Wrap...")
        await page.wait_for_timeout(DURATIONS["14_Future_Closing"] * 1000)
        await page.wait_for_timeout(DURATIONS["15_Final_Tagline"] * 1000)

        print("Recording Complete.")
        await context.close()
        await browser.close()
        
        # Identify the video file
        video_files = [f for f in os.listdir(".") if f.endswith(".webm")]
        if video_files:
            return sorted(video_files, key=os.path.getmtime)[-1]
        return None

def mix_audio(video_path):
    print(f"Mixing audio for {video_path}...")
    video = VideoFileClip(video_path)
    
    # Ordered keys
    keys = [
        "01_Intro_Panic_Gap", "02_The_Solution", "03_Multimodal", "04_Zero_Latency",
        "05_Dashboard_Overview", "06_Select_Bleeding", "07_Live_Diagnostics", "08_Bleeding_Instruction",
        "11_Clinical_Briefing", "12_Google_Drive", "13_Time_Saved",
        "09_Child_Choking", "10_Choking_Guidance",
        "14_Future_Closing", "15_Final_Tagline"
    ]
    
    clips = []
    for key in keys:
        path = os.path.join(VOICEOVER_DIR, f"{key}.mp3")
        if os.path.exists(path):
            clips.append(AudioFileClip(path))
    
    final_audio = concatenate_audioclips(clips)
    
    # Trim video to match audio exactly if there's drift
    # moviepy will automatically handle the duration mismatch if we set the audio
    video = video.set_audio(final_audio)
    video.write_videofile(OUTPUT_VIDEO, codec="libx264", audio_codec="aac", fps=30)
    print(f"SUCCESS: {OUTPUT_VIDEO} created.")

async def main():
    video_file = await record_browser()
    if video_file:
        mix_audio(video_file)
        # Cleanup webm
        # os.remove(video_file)

if __name__ == "__main__":
    asyncio.run(main())
