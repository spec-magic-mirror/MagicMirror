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

def dbg(msg):
  with open("/home/pi/workspace/tmp/eye_cascade_log.txt","a+") as f:
    time_str = str(datetime.now())
    f.write(time_str + ": " + msg + "\n")	

dbg("START")

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
  camera.resolution = (3280, 2464)
  camera.rotation = 180
  camera.exposure_compensation = 8
  camera.exposure_mode = 'night'
  camera.video_stabilization = True
else: 
  cap = cv2.VideoCapture(0)

dbg("CREATED CAMERA")

log_path = path_to_file + '/../log/'
if not os.path.exists(log_path):
  os.makedirs(log_path)
filename = log_path + datetime.now().isoformat("T")

dbg("CAMERA WARMING UP")
# allow the camera sensor to warmup
time.sleep(2)

dbg("SENDING MESSAGE TO FRONT")
to_node('camera_ready', True)

dbg("CAPTURING")
if usingPi:
  camera.capture(filename + '.jpg')
  dbg("IMAGE CAPTURED, READING FROM FILE")
  img = cv2.imread(filename + ".jpg")
else:
  retval, img = cap.read()
  cap.release()
dbg("DONE CAPTURING")
to_node('image_captured', True)
buf = None
dbg("ENCODING")
try:
  img, buf = cv2.imencode(".jpg", img)
except:
  to_node('error', sys.exc_info()[0])

cv2.destroyAllWindows()

dbg("RETURN RESPONSE TO MIDDLE")
url = "http://" + CONFIG["middleware_addr"] + "/detect_moles"
responses = requests.post(url, files={"Front": base64.b64encode(buf)})

dbg("RETURN RESPONSE TO FRONT")
to_node('backend', responses.json().get('Front'))

#time.sleep(5)









