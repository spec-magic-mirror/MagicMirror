from imutils.video import VideoStream
from datetime import datetime
import imutils
import cv2
import numpy as np
import sys
import json
import os
import time
import inspect
import requests
import base64

usingPi = True

try:
  from picamera import PiCamera
except Exception as e:
  usingPi = False


# Configuration from MMM
CONFIG = json.loads(sys.argv[1])
path_to_file = os.path.dirname(os.path.abspath(
    inspect.getfile(inspect.currentframe())))
if usingPi:
  camera = PiCamera(sensor_mode = 2)
  camera.resolution = "3280 * 2464"
  camera.rotation = 180
  camera.exposure_compensation = 8
  camera.exposure_mode = 'night'
  camera.video_stabilization = True
else: 
  cap = cv2.VideoCapture(0)



log_path = path_to_file + '/../log/'
if not os.path.exists(log_path):
  os.makedirs(log_path)
filename = log_path + datetime.now().isoformat("T")

def to_node(type, message):
  # Send message to MMM
  # convert to json and print (node helper will read from stdout)
  try:
    print(json.dumps({type: message}))
  except Exception:
    pass
  # stdout has to be flushed manually to prevent delays in the node helper
  # communication
  sys.stdout.flush()

# allow the camera sensor to warmup
time.sleep(2)

to_node('camera_ready', True)

time.sleep(2)

if usingPi:
  camera.capture(filename + '.png')
else:
  retval, img = cap.read()
  cap.release()


try:
  img, buf = cv2.imencode(".jpg", img)
except:
  to_node('error', sys.exc_info()[0])

cv2.destroyAllWindows()


url = "http://" + CONFIG["middleware_addr"] + "/detect_moles"
responses = requests.post(url, files={"Front": base64.b64encode(buf)})

to_node('backend', responses.json().get('Front'))

time.sleep(5)









