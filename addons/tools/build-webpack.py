import subprocess

p = subprocess.Popen(["npm", "install"], shell=True)
p.wait()

p = subprocess.Popen(["webpack"], shell=True)
p.wait()