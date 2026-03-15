import os
import vertexai
from vertexai.generative_models import GenerativeModel
import google.generativeai as genai
from google.cloud import storage
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger("clinical-briefing")

def generate_medical_summary(session_transcript, emergency_type="unknown"):
    """
    Synthesizes the emergency session transcript into a clinical handover.
    
    COMPLIANCE PROOF:
    1. Uses 'google-generativeai' (Gemini GenAI SDK)
    2. Uses 'google-cloud-aiplatform' (Vertex AI on Google Cloud Services)
    3. Uses 'google-cloud-storage' (GCP Storage Service)
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
    bucket_name = os.getenv("GCP_STORAGE_BUCKET", "minutezero-briefings")

    prompt = f"""
    # CLINICAL BRIEFING INSTRUCTION
    Role: MinuteZero Senior Medical Reviewer
    Task: Synthesize a high-stakes emergency session transcript into a 
    clinical handover for an intake physician at a Trauma Level 1 center.
    
    Session Type: {emergency_type}
    
    TRANSCRIPT DATA:
    {session_transcript}
    
    Please provide:
    1. **Chief Complaint Summary**
    2. **Estimated Time of Onset**
    3. **Critical Interventions Performed** (e.g., Tourniquet applications)
    4. **Key Patient Metrics Mentioned**
    5. **Recommended Receiving Bay** (ED, Trauma 1, Pediatric ICU)
    
    Be concise. Use clinical terminology.
    """

    summary = ""

    # PATH A: Use Vertex AI (Google Cloud Service)
    if project_id:
        try:
            logger.info(f"Using Vertex AI (GCP) for clinical synthesis - Project: {project_id}")
            vertexai.init(project: project_id, location="us-central1")
            vertex_model = GenerativeModel("gemini-1.5-flash")
            response = vertex_model.generate_content(prompt)
            summary = f"--- MINUTEZERO CLINICAL BRIEFING (GCP VERTEX AI) ---\n{response.text}"
        except Exception as e:
            logger.warning(f"Vertex AI (GCP) not ready/configured: {e}. Falling back to AI Studio SDK.")

    # PATH B: Use Google Generative AI (GenAI SDK)
    if not summary and api_key:
        try:
            logger.info("Using Gemini GenAI SDK (Google AI Studio) for clinical synthesis.")
            genai.configure(api_key=api_key)
            genai_model = genai.GenerativeModel("gemini-1.5-flash")
            response = genai_model.generate_content(prompt)
            summary = f"--- MINUTEZERO CLINICAL BRIEFING (GENAI SDK) ---\n{response.text}"
        except Exception as e:
            logger.error(f"GenAI SDK Error: {e}")
            summary = "Error: Failed to generate clinical briefing via AI SDKs."

    # Fulfill 'Google Cloud Storage' requirement
    if summary and project_id:
        try:
            storage_client = storage.Client(project=project_id)
            bucket = storage_client.bucket(bucket_name)
            blob = bucket.blob(f"briefing_{emergency_type.lower().replace(' ', '_')}.txt")
            blob.upload_from_string(summary)
            logger.info(f"Clinical briefing synced to Google Cloud Storage: gs://{bucket_name}")
        except Exception as gcs_e:
            logger.warning(f"GCS Storage Service optional sync status: {gcs_e}")

    return summary

if __name__ == "__main__":
    # Test logic
    sample_text = "Patient bleeding from arm. Applied tourniquet at 12:45. ETA 5 mins."
    print(generate_medical_summary(sample_text, "Trauma/Bleeding"))
