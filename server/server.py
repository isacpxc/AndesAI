from flask import Flask
from flask import Response
from flask import request
import json

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.post("/improve")
def improve_text():
    res = request.get_json()
    json_res = {"received_Text": res["text_to_improve"]}
    return json_res