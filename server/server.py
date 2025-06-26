from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json

# running on http://127.0.0.1:5000/improve

url = "http://localhost:11434/api/generate"

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.post("/improve")
def improve_text():
    try:
        data = request.get_json()
        text_to_improve = data['text_to_improve']
    except Exception as e:
        return jsonify({"error": "JSON inválido ou faltando 'text_to_improve'"}), 400
    
    ollama_payload = {
        "model": "llama3.1:8b", 
        "prompt": f"Correct the following text based on the grammar and semantics of used language. Only return the corrected and improved text, without adding comments, explanations or observations. The result must contain only the revised text. Text: {text_to_improve}",
        "stream": False}
    try:
        response = requests.post(url=url, json=ollama_payload)
        response.raise_for_status()
        
        ollama_data = response.json()
        improved_text = ollama_data.get("response", "") # return "" is key doesn't exist 
        
        return jsonify({"improved_text": improved_text})
        
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error comunicating with ollama: {e}"}), 503 
    except Exception as e:
        return jsonify({"error": f"Unexpected Server Error: {e}"}), 500
        
    
if __name__ == '__main__':
    app.run(port=5000, debug=True)
