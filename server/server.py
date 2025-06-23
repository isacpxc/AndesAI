from flask import Flask
from flask import request
import requests
import json

url = "http://localhost:11434/api/generate"

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.post("/improve")
def improve_text():
    req = request.get_json()
    text_to_improve = req['text_to_improve']
    json_res = {
        "model": "llama3.1:8b", 
        "prompt": f"Correct the following text based on the grammar and semantics of used language. Only return the corrected and improved text, without adding comments, explanations or observations. The result must contain only the revised text. Text: {text_to_improve}",
        "stream": False}
    
    res = requests.post(url=url, json=json_res)
    res = json.loads(res.text)
    res = res["response"]
    
    return res
