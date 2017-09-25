import numpy as np
import cv2

class Calibrate:
	"""docstring for Calibrate"""
	

	def __init__(self, fname):
		self.fname = fname
        # self.eyes_coordinates = np.zeros((2,4))
        # self.face_coordinates = np.zeros((1,4)) 
        # self.img = cv2.imread(self.fname)


	def detect_face_eyes(self):
		gray = cv2.imread(self.fname, 0)

		gray = cv2.resize(gray, dsize=(640, 360))
		face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
		eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')
		# gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
		faces = face_cascade.detectMultiScale(gray, 1.1, 10)
		for (x,y,w,h) in faces:
			cv2.rectangle(gray,(x,y),(x+w,y+h),(255,0,0),2)
			roi_gray = gray[y:y+h, x:x+w]
			roi_color = gray[y:y+h, x:x+w]
			eyes = eye_cascade.detectMultiScale(roi_gray)
			for (ex,ey,ew,eh) in eyes:
				cv2.rectangle(roi_color,(ex,ey),(ex+ew,ey+eh),(0,255,0),2)
		cv2.imshow('img',gray)
		cv2.waitKey(0)
		cv2.destroyAllWindows()

ct = Calibrate("./../log/test1.jpg")
ct.detect_face_eyes()
