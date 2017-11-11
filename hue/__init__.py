
from flask import Flask
from flask_assets import Environment
import yaml

__all__ = ["hue"]

app = Flask(__name__)
app.config.from_object("hue.debug_config.DebugConfig")
with open("config.yaml") as f:
    app.config.update(yaml.load(f))
assets = Environment(app)

import hue.views
