import logging
import os
from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
)
from livekit.agents.voice import Agent, AgentSession
from livekit.plugins.google import realtime

load_dotenv()

logger = logging.getLogger("minute-zero-agent")
logger.setLevel(logging.INFO)

async def entrypoint(ctx: JobContext):
    logger.info(f"Connecting to room: {ctx.room.name}")
    
    # Connect with audio capabilities
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    # Participant connects - wait for the user
    participant = await ctx.wait_for_participant()
    logger.info(f"Starting MinuteZero for participant: {participant.identity}")
    
    emergency_type = participant.metadata
    logger.info(f"Emergency Type: {emergency_type}")

    # Use the new RealtimeModel from livekit.plugins.google
    model = realtime.RealtimeModel(
        instructions="""
You are MinuteZero (MZ), the world's most advanced AI First Responder. 
Your goal is to guide the user through life-threatening emergencies with zero latency during the critical 'Golden Minute'.

CORE DIRECTIVES:
1. SIGHT: Use the video stream to assess wounds, patient position, and environment.
2. VOICE: Calm, directive, and authoritative. NO FILLER WORDS.
3. PROTOCOLS: Strictly follow AHA/Red Cross guidelines.
4. ACTIONS: If you see someone struggling, count the rhythm for them (e.g., 'One, two, three, four' for CPR).

Keep responses brief. Be the calm in the storm.
""",
    )

    # Create the Agent instance - this defines the AI logic
    agent = Agent(
        instructions="MinuteZero Emergency Assistant",
        llm=model,
    )
    
    # Create the AgentSession - this glues everything together
    session = AgentSession(llm=model)
    
    # Start the session in the room
    await session.start(agent, room=ctx.room)
    logger.info("MinuteZero Agent active and monitoring feed.")

    # If a specific emergency was selected, trigger an immediate response
    if emergency_type and emergency_type != "null" and emergency_type != "":
        logger.info(f"Triggering rapid response for: {emergency_type}")
        session.generate_reply(
            instructions=f"The user has urgently reported: {emergency_type}. Immediately acknowledge this emergency and provide the FIRST critical step of the protocol."
        )

    # Keep the agent running until disconnect
    await ctx.wait_for_disconnect()
    logger.info("MinuteZero session ended.")

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
        )
    )
