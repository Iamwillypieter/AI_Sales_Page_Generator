import os
import google.generativeai as genai
import json

class UserMessage:
    def __init__(self, text):
        self.text = text

class LlmChat:
    def __init__(self, api_key=None, session_id=None, system_message=None):
        # Ambil key dari env
        actual_key = api_key or os.environ.get("GEMINI_API_KEY") or os.environ.get("EMERGENT_LLM_KEY")
        
        if not actual_key:
            print("ERROR: API Key tidak ditemukan di .env")
            return
            
        genai.configure(api_key=actual_key)
        
        # Kita pakai model 'gemini-pro' sebagai alternatif paling stabil
        # atau 'gemini-1.5-flash-latest'
        self.model = genai.GenerativeModel(
            model_name="gemini-pro", 
            system_instruction=system_message
        )

    def with_model(self, provider, model_name):
        return self 
    
    async def send_message(self, message):
        try:
            # Tambahkan instruksi paksa agar hasilnya JSON murni
            prompt = f"{message.text}\n\nIMPORTANT: Return ONLY a valid JSON object. No markdown, no ```json tags."
            
            # Panggil AI
            response = self.model.generate_content(prompt)
            
            if not response.text:
                print("DEBUG: Gemini memberikan jawaban kosong.")
                return "{}"
                
            return response.text
            
        except Exception as e:
            # INI KUNCI BIAR GAK CORS: Kalau AI gagal, balikin JSON kosong, jangan biarkan crash
            print(f"CRITICAL ERROR AI: {str(e)}")
            # Kita balikin string JSON kosong supaya server.py tidak crash saat parse
            return json.dumps({
                "headline": "Error: AI tidak merespon",
                "subheadline": "Silahkan cek koneksi internet atau API Key Anda.",
                "description": str(e),
                "benefits": [], "features": [], "socialProof": {"stats": [], "testimonials": []},
                "pricing": {"headline": "", "price": "", "billing": "", "includes": [], "guarantee": ""},
                "cta": {"primary": "Error", "secondary": "", "urgency": ""}
            })