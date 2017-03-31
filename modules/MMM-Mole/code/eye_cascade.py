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
eyePath = path_to_file + '/haarcascade_eye.xml'
faceCascade = cv2.CascadeClassifier(facePath)
eyeCascade = cv2.CascadeClassifier(eyePath)

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
vs = VideoStream(usePiCamera=CONFIG['usePiCam']).start()
# cap = cv2.VideoCapture(usePiCamera=CONFIG['usePiCam'])

# allow the camera sensor to warmup
time.sleep(2)
to_node('camera_ready', True)
i = 0
# track smile time
imgs = []
imageOrder = ["Front", "Left", "Back", "Right"]

response = requests.get("http://localhost:5000/get_test")
to_node('backend', response.content)

time.sleep(3)
while True:
  # take a frame every second
  time.sleep(10)

  # use VS instead of cv2.VideoCapture
  frame = vs.read()
  # print(frame)
  # try:
  #   gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
  # except:
  #   to_node('error', sys.exc_info()[0])
  #   break
  # cv2.imwrite(log_path + datetime.now().isoformat("T") + '.jpg', frame)
  try:
    frame, buf = cv2.imencode(".jpg", frame)
  except:
    to_node('error', sys.exc_info()[0])
    break

  # TODO: Send images base64 to REST, 
  imgs.append(buf)

  # response = requests.post("http://localhost:5000/detect_moles", files={"front": base64.b64encode(buf)})
  
  i += 1
  to_node('success', True)

  # print(CONFIG['captureAngle'])
  if i >= 4:
    i = 0
    break

  # faces = faceCascade.detectMultiScale(
  #     gray,
  #     scaleFactor=1.1,
  #     minNeighbors=8,
  #     minSize=(55, 55),
  #     flags=cv2.CASCADE_SCALE_IMAGE
  # )

  # for (x, y, w, h) in faces:
  #   cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 1)
  #   roi_gray = gray[y:y + h, x:x + w]
  #   roi_color = frame[y:y + h, x:x + w]

  #   eye = eyeCascade.detectMultiScale(
  #       roi_gray,
  #       scaleFactor=1.2,
  #       minNeighbors=10,
  #       minSize=(20, 20),
  #       flags=cv2.CASCADE_SCALE_IMAGE
  #   )

  #   if(len(eye) > 0):
  #     eyeTime += 1
  #     to_node('result', eyeTime)

  #     # log the eye test with a selfie
  #     if eyeTime == (CONFIG['eyeLength'] / 2):
  #       for (x, y, w, h) in eye:
  #         cv2.rectangle(roi_color, (x, y), (x + w, y + h), (255, 0, 0), 1)
  #       cv2.imwrite(log_path + datetime.now().isoformat("T") + '.jpg', frame)

  # cv2.imshow('Eye Detector', frame)
  if cv2.waitKey(1) & 0xFF == ord('q'):
    break

  # if smileTime >= CONFIG['smileLength']:
  #   smileTime = 0
  #   break

  # if time.time() >= endtime:
  #   to_node('result', -1)
  #   break
  # Capture frame-by-frame
    # ret, frame = cap.read()

    # # Our operations on the frame come here
    # gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # # Display the resulting frame
    # cv2.imshow('frame',gray)
    # if cv2.waitKey(1) & 0xFF == ord('q'):
    #     break


# When everything done, release the capture
# cap.release()
# cv2.destroyAllWindows()

vs.stop()
cv2.destroyAllWindows()

for i in range(0,4):
  response = requests.post("http://localhost:5000/detect_moles", files={imageOrder[i]: base64.b64encode(imgs[i])})








