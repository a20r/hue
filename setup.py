
from setuptools import setup

setup(name="hue",
      packages=["hue"],
      include_package_data=True,
      install_requires=[
          "flask",
          "flask_assets",
          "qhue"
      ])
