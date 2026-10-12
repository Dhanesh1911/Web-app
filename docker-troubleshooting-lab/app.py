from flask import Flask
import os

app = Flask(__name__)

@app.route("/")
def home():
    return """
    <html>
        <head>
            <title>Docker Troubleshooting Lab</title>
        </head>
        <body>
            <h1>Docker Lab is Running!</h1>
            <p>Congratulations! Your application is working.</p>
        </body>
    </html>
    """

if __name__ == "__main__":
    port = int(os.getenv("APP_PORT", "5000"))

    app.run(
        host="0.0.0.0",
        port=port
    )
