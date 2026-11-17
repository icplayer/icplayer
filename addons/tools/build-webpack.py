import subprocess
from sys import platform


def build_linux():
    p = subprocess.Popen(["npm install"], shell=True)
    p.wait()

    p = subprocess.Popen(["./node_modules/.bin/webpack"], shell=True)
    p.wait()


def build_windows():
    p = subprocess.Popen(["npm", "install"], shell=True)
    p.wait()

    p = subprocess.Popen(["node_modules\\.bin\\webpack.cmd"], shell=True)
    p.wait()


if platform == "linux" or platform == "linux2" or platform == "darwin":
    build_linux()
else:
    build_windows()

