import logging
import os
from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
    multimodal,
)
from livekit.plugins.google import realtime

load_dotenv()

logger = logging.getLogger("minute-zero-agent")
logger.setLevel(logging.INFO)

async def entrypoint(ctx: JobContext):
    logger.info(f"Connecting to room: {ctx.room.name}")
    
    # Connect with full audio/video capabilities
    await ctx.connect(auto_subscribe=AutoSubscribe.SUBSCRIBE_ALL)

    # Participant connects - wait for the user
    participant = await ctx.wait_for_participant()
    logger.info(f"Starting MinuteZero for participant: {participant.identity}")
    
    emergency_type = participant.metadata
    logger.info(f"Emergency Type: {emergency_type}")

    # Define tools for the agent
    fnc_ctx = multimodal.FunctionContext()

    @fnc_ctx.ai_callable(description="Search Google for the nearest hospitals, trauma centers, or medical facilities based on current location and emergency type.")
    async def search_medical_facilities(query: str):
        logger.info(f"AI requested hospital search: {query}")
        # In a real app, this would use a Google Search API or Maps API
        # For the hackathon, we simulate the 'Active Search' capability
        return "Nearest Level 1 Trauma Center: Memorial Hermann - Texas Medical Center. Located 2.4 miles away. ETA: 6 minutes. Status: Diversion active for ER, but accepting Trauma Level 1."

    # Use the RealtimeModel for Gemini 1.5 Pro
    model = realtime.RealtimeModel(
        instructions="""
You are MinuteZero (MZ), the world's most advanced AI First Responder. 
Your goal is to guide the user through life-threatening emergencies with zero latency during the critical 'Golden Minute'.

CORE DIRECTIVES:
1. SIGHT: Use the video stream to assess wounds, patient position, and environment.
2. VOICE: Calm, directive, and authoritative. NO FILLER WORDS.
3. PROTOCOLS: Strictly follow AHA/Red Cross guidelines.
4. ACTIVE SEARCH: If the emergency is critical, automatically search for the nearest specialized hospital (e.g., Trauma Level 1 for bleeding, Pediatric ICU for choking) and inform the user.

Keep responses brief. Be the calm in the storm.
""",
        voice="puck",
        temperature=0.6,
    )

    # Create the MultimodalAgent with tools
    agent = multimodal.MultimodalAgent(
        model=model,
        fnc_ctx=fnc_ctx,
    )

    # Start the agent in the room
    agent.start(ctx.room, participant)
    logger.info("MinuteZero Multimodal Agent active.")

    # Trigger immediate response if an emergency was selected on landing
    if emergency_type and emergency_type not in ["null", "", "undefined"]:
        logger.info(f"Rapid Response Trigger: {emergency_type}")
        agent.generate_reply(
            f"The user has an urgent {emergency_type} emergency. Acknowledge and give the first critical instruction immediately."
        )

    # Wait for session completion
    await ctx.wait_for_disconnect()
    logger.info("MinuteZero session ended.")

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
        )
    )
