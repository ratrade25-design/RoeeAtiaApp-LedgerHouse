from flask import Flask, render_template, request, jsonify
import os, json, datetime

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/health")
def health():
    return jsonify(status="ok", ts=datetime.datetime.utcnow().isoformat())

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5060))
    app.run(host="0.0.0.0", port=port, debug=False)
