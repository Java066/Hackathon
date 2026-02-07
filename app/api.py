from flask import Flask, request, jsonify, send_from_directory
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Use OpenAI via the official SDK (already in requirements)
DEFAULT_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
API_KEY = os.getenv("LLM_API_KEY", "")
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CHAT_DIR = os.path.join(BASE_DIR, 'ai_chat_app')


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    message = data.get("message", "")
    if not message:
        return jsonify({"error": "message required"}), 400

    if not API_KEY:
        return jsonify({"error": "LLM API key not configured"}), 500

    try:
        from openai import OpenAI

        client = OpenAI(api_key=API_KEY)

        # Simple single-turn chat via Responses API
        resp = client.responses.create(
            model=DEFAULT_MODEL,
            input=message,
            temperature=0.7,
        )

        text = (resp.output_text or "").strip()

        return jsonify({"reply": text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/chat/')
def ai_chat_index():
    return send_from_directory(CHAT_DIR, 'ai-chat.html')


@app.route('/chat/js/<path:filename>')
def serve_chat_js(filename):
    return send_from_directory(os.path.join(CHAT_DIR, 'js'), filename)


@app.route('/chat/css/<path:filename>')
def serve_chat_css(filename):
    return send_from_directory(os.path.join(CHAT_DIR, 'css'), filename)


# Also serve integrated site chat page if present in project root
@app.route('/ai-chat.html')
def ai_chat_site():
    return send_from_directory(BASE_DIR, 'ai-chat.html')


# Generic static file serving for the site (index and other pages)
@app.route('/', defaults={'path': 'index.html'})
@app.route('/<path:path>')
def static_site(path):
    # Avoid capturing API and chat endpoints
    if path.startswith('api/') or path.startswith('chat/'):
        return ("Not Found", 404)
    # Normalize path and serve from project root
    safe_path = os.path.normpath(path)
    return send_from_directory(BASE_DIR, safe_path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

