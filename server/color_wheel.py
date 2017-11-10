import time
import qhue

# bridge = qhue.Bridge("192.168.1.214",
#                      "99v4t-XnAI42M0U6Faojb-dsGav5nfseGoBDbfCo")

BRIDGE_IP = "192.168.1.214"
USER = "99v4t-XnAI42M0U6Faojb-dsGav5nfseGoBDbfCo"


class HomeBridge(qhue.Bridge):

    def __init__(self):
        qhue.Bridge.__init__(self, BRIDGE_IP, USER)

    def color_wheel(self, bri, delay, step):
        hue = 0
        while True:
            self.lights[3].state(on=True, bri=bri, hue=hue)
            # self.lights[4].state(on=True, bri=bri, hue=hue)
            if hue + step > 50000 or hue + step <= 0:
                step = -step
            hue += step
            time.sleep(delay)


if __name__ == "__main__":
    b = HomeBridge()
    b.color_wheel(255, 0.5, 1000)
