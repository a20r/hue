
from flask import render_template
from server import app
import qhue


@app.route("/test", methods=["GET"])
def get_test():
    return "hello world"


@app.route("/", methods=["GET"])
def get_index():
    return render_template("index.html")
