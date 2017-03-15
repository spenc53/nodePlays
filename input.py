import urllib2
import subprocess
from time import sleep

url = "localhost:3000"

data = urllib2.urlopen("http://" + url +"/commands").read()
urllib2.urlopen("http://" + url + "/clear").read()
data = data.replace("[","")
data = data.replace("]", "")
data = data.replace("\"","")
data = data.split(",")

keyMap = {'a':'a', 'b':'b','start':'Enter','select':'BackSpace',"left":"Left","right":"Right","down":"Down","up":"Up"}

for command in data:
    command = command.lower()

    if not(command in keyMap):
        continue

    # xdoDown = "xdotool keydown " + command
    # xdoUp = "xdotool keyup " + command
    # xdoDown = xdoDown.split()
    # xdoUp = xdoUp.split()
    xdo = "echo " + keyMap[command]
    xdo = xdo.split()
    subprocess.Popen(xdo)
    # subprocess.Popen(xdoDown)
    # subprocess.Popen(xdoUp)
    # ????? sleep(50) ?????