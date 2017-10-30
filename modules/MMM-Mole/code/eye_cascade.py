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

# Configuration from MMM
CONFIG = json.loads(sys.argv[1])

# Computer vision lib files needed by OpenCV
path_to_file = os.path.dirname(os.path.abspath(
    inspect.getfile(inspect.currentframe())))
facePath = path_to_file + '/haarcascade_frontalface_default.xml'

face_cascade = cv2.CascadeClassifier(facePath)


log_path = path_to_file + '/../log/'
if not os.path.exists(log_path):
  os.makedirs(log_path)


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

# *************************************************************
# Main function
# *************************************************************

# Start video stream
# vs = VideoStream(usePiCamera=CONFIG['usePiCam']).start()
cap = cv2.VideoCapture(0)

# cap.set(CV_CAP_PROP_FRAME_WIDTH,640);
# cap.set(CV_CAP_PROP_FRAME_HEIGHT,480);


# allow the camera sensor to warmup
time.sleep(2)

to_node('camera_ready', True)

time.sleep(2)

retval, img = cap.read()
cap.release()

try:
  gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
except:
  to_node('error', sys.exc_info()[0])


filename = log_path + datetime.now().isoformat("T")

cv2.imwrite(filename + '.png', img)




# image = cv2.imread(filename)


faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1,minNeighbors=8,minSize=(55, 55),flags=cv2.CASCADE_SCALE_IMAGE)

if len(faces) == 0:
  to_node('error', sys.exc_info()[0])

for (x,y,w,h) in faces:
  crop = img[y - 25: y + h + 25, x: x + w]
  # cv2.imwrite(log_path + "crop.png", crop)
  cv2.imwrite(filename + '_crop.png', crop)



try:
  img, buf = cv2.imencode(".jpg", crop)
except:
  to_node('error', sys.exc_info()[0])



# vs.stop()
cv2.destroyAllWindows()
responses = requests.post("http://localhost:5000/detect_moles", files={"Front": base64.b64encode(buf)})

to_node('backend', responses.json().get('Front'))

time.sleep(5)
# to_node('success', True)
# time.sleep(5)








