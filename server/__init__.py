
from flask import Flask
from flask_assets import Environment

app = Flask(__name__)
app.config.from_object("server.debug_config.DebugConfig")
assets = Environment(app)

import server.views
