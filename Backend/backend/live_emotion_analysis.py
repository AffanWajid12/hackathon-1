from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import base64
import librosa
import soundfile as sf
import numpy as np
import io
import whisper
from groq import Groq
import os
import subprocess
import tempfile


# ==================== Setup ==================== #
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# HuggingFace emotion classifier
emotion_analyzer = pipeline(
    "text-classification",
    model="SamLowe/roberta-base-go_emotions",
    top_k=None
)

# Whisper speech-to-text
whisper_model = whisper.load_model("base")

# Groq LLM
GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)
MODEL_NAME = "llama3-8b-8192"

EMOTION_MAPPING = {
    'admiration': 'Admiration', 'amusement': 'Amusement', 'anger': 'Anger', 'annoyance': 'Annoyance',
    'approval': 'Approval', 'caring': 'Caring', 'confusion': 'Confusion', 'curiosity': 'Curiosity',
    'desire': 'Desire', 'disappointment': 'Disappointment', 'disapproval': 'Disapproval',
    'disgust': 'Disgust', 'embarrassment': 'Embarrassment', 'excitement': 'Excitement',
    'fear': 'Fear', 'gratitude': 'Gratitude', 'grief': 'Grief', 'joy': 'Joy', 'love': 'Love',
    'nervousness': 'Nervousness', 'optimism': 'Optimism', 'pride': 'Pride', 'realization': 'Realization',
    'relief': 'Relief', 'remorse': 'Remorse', 'sadness': 'Sadness', 'surprise': 'Surprise',
    'neutral': 'Neutral'
}

VALID_EMOTIONS = [
    "happy", "sad", "anxious", "angry", "calm", "stressed", "excited", "neutral", "lonely",
    "tired", "confused", "surprised", "grateful", "frustrated", "hopeful", "bored"
]


# ==================== Helpers ==================== #

def enhance_audio(audio_bytes):
    # Step 1: Save incoming audio (webm/ogg/etc) to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as input_file:
        input_file.write(audio_bytes)
        input_path = input_file.name

    # Step 2: Convert to WAV using ffmpeg
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as output_file:
        output_path = output_file.name

    # Run ffmpeg conversion command
    try:
        subprocess.run([
            "ffmpeg", "-y", "-i", input_path, "-ar", "44100", "-ac", "1", output_path
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except subprocess.CalledProcessError as e:
        print("❌ ffmpeg conversion failed:", e)
        raise RuntimeError("ffmpeg conversion failed")

    # Step 3: Load the converted WAV using librosa
    y, sr = librosa.load(output_path, sr=44100)
    y = librosa.effects.preemphasis(y)
    y = librosa.util.normalize(y)

    # Step 4: Return WAV bytes
    buffer = io.BytesIO()
    sf.write(buffer, y, sr, format='WAV')
    return buffer.getvalue()

def transcribe_audio_bytes(audio_bytes):
    try:
        with open("temp.wav", "wb") as f:
            f.write(audio_bytes)
        result = whisper_model.transcribe("temp.wav")
        return result["text"]
    except Exception as e:
        print("❌ Whisper transcription error:", e)
        return None

def analyze_emotions_hf(text):
    try:
        raw_results = emotion_analyzer(text)[0]
        results = [{
            'label': EMOTION_MAPPING[r['label']],
            'score': r['score']
        } for r in raw_results if r['label'] in EMOTION_MAPPING]
        results.sort(key=lambda x: x['score'], reverse=True)
        return results
    except Exception as e:
        print("❌ HuggingFace emotion error:", e)
        return []
import re

def extract_valid_emotions(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)  # Remove punctuation
    words = set(text.split())
    return [e for e in VALID_EMOTIONS if e in words]

def analyze_emotions_groq(text):
    prompt = f"""
You are an emotion classification assistant.

Your task is to detect the main emotion expressed in a message.

Only respond with **one word**, and only from this list:
{', '.join(VALID_EMOTIONS)}

Respond with just the emotion. Do not include punctuation or explanation.

Message: "{text}"
Emotion:
"""
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=MODEL_NAME
        )
        raw_emotion = response.choices[0].message.content.strip()
        print("📦 Raw Groq response:", repr(raw_emotion))

        # Extract valid emotions from response
        detected = extract_valid_emotions(raw_emotion)
        return detected

    except Exception as e:
        print("❌ Groq classification error:", e)
        return []



# ==================== API Routes ==================== #

@app.route("/analyze", methods=["POST"])
def analyze_audio():
    """Analyze emotions from audio"""
    try:
        data = request.get_json()
        if "audio" not in data:
            return jsonify({"error": "Missing 'audio' field"}), 400

        audio_b64 = data["audio"]
        audio_bytes = base64.b64decode(audio_b64)
        enhanced = enhance_audio(audio_bytes)

        text = transcribe_audio_bytes(enhanced)

        if not text or text.strip() == "":
            return jsonify({
                "error": "No speech detected. Please try speaking clearly into the mic."
            }), 400

        emotions_hf = analyze_emotions_hf(text)
        emotions_groq = analyze_emotions_groq(text)

        return jsonify({
            "transcribed_text": text,
            "huggingface_emotions": emotions_hf[:5],
            "groq_emotions": emotions_groq
        })

    except Exception as e:
        print("❌ Audio analysis error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/analyze-text", methods=["POST"])
def analyze_text():
    """Analyze emotions from text"""
    try:
        data = request.get_json()
        if "text" not in data:
            return jsonify({"error": "Missing 'text' field"}), 400

        text = data["text"].strip()
        if not text:
            return jsonify({"error": "Empty text provided"}), 400

        emotions_hf = analyze_emotions_hf(text)
        emotions_groq = analyze_emotions_groq(text)

        return jsonify({
            "transcribed_text": text,  # Keep same structure as audio for consistency
            "huggingface_emotions": emotions_hf[:5],
            "groq_emotions": emotions_groq
        })

    except Exception as e:
        print("❌ Text analysis error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Emotion analyzer is running"})


# ==================== Run ==================== #
if __name__ == "__main__":
    print("🚀 Starting Emotion Analyzer Backend...")
    print("📱 Audio Analysis: POST /analyze")
    print("💬 Text Analysis: POST /analyze-text")
    print("🏥 Health Check: GET /health")
    app.run(debug=True, host="0.0.0.0", port=5000)