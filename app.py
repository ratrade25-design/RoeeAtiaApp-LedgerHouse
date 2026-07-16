from flask import Flask, render_template, request, jsonify
import os, json, datetime, threading, time

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/health")
def health():
    return jsonify(status="ok", ts=datetime.datetime.utcnow().isoformat())

def _keep_alive():
    """Ping ourselves every 13 minutes so Render free tier doesn't sleep."""
    import urllib.request
    time.sleep(60)
    url = os.environ.get('RENDER_EXTERNAL_URL', '')
    if not url:
        return
    url = url.rstrip('/') + '/health'
    while True:
        try:
            urllib.request.urlopen(url, timeout=10)
            print(f"[{datetime.datetime.now():%H:%M:%S}] keep-alive ping OK")
        except Exception:
            pass
        time.sleep(780)

threading.Thread(target=_keep_alive, daemon=True, name="ping").start()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5060))
    app.run(host="0.0.0.0", port=port, debug=False)
