
from flask import Flask
from flask_assets import Environment

__all__ = ["hue"]

app = Flask(__name__)
app.config.from_object("hue.debug_config.DebugConfig")
app.config["bridge_ip"] = "192.168.1.214"
app.config["bridge_user"] = "99v4t-XnAI42M0U6Faojb-dsGav5nfseGoBDbfCo"
assets = Environment(app)

import hue.views
