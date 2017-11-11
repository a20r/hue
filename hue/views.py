
from __future__ import division
from flask import render_template
from flask import request
from hue import app
import json
import qhue

bridge = qhue.Bridge(app.config["bridge_ip"], app.config["bridge_user"])


@app.route("/state", methods=["POST"])
def change_light_state():
    form = request.get_json()
    bridge.lights[form["light"]].state(on=form["state"])
    return "", 200


@app.route("/light/<light>", methods=["GET"])
def get_light_state(light):
    return json.dumps(bridge.lights[light]())


@app.route("/light_test/<light>", methods=["GET"])
def get_light_state_test(light):
    color_light = dict(
        type="Extended color light",
        name="Hue color light 1",
        state={"reachable": True,
               "on": True})
    return json.dumps(color_light)


@app.route("/color", methods=["POST"])
def change_light_color():
    form = request.get_json()
    hue = int((form["hue"] / 360) * 65534)
    sat = int(form["saturation"] * 254)
    bridge.lights[form["light"]].state(hue=hue, sat=sat)
    return "", 200


@app.route("/brightness", methods=["POST"])
def change_light_brightness():
    form = request.get_json()
    bri = int(form["brightness"])
    bridge.lights[form["light"]].state(bri=bri)
    return "", 200


@app.route("/temperature", methods=["POST"])
def change_color_temperature():
    form = request.get_json()
    ct = int(form["temperature"])
    bridge.lights[form["light"]].state(ct=ct)
    return "", 200


@app.route("/", methods=["GET"])
def get_index():
    lights = bridge.lights()
    return render_template("index.html", lights=lights)


@app.route("/test", methods=["GET"])
def get_test():
    color_light = dict(
        type="Extended color light",
        name="Hue color light 3",
        state={"reachable": True,
               "on": False})
    lights = {"3": color_light}
    return render_template("index.html", lights=lights)
