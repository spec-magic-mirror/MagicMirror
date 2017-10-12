import numpy as np
import cv2
import dlib
from skimage import io
from sets import Set
'''
The mouth can be accessed through points [48, 68].
The right eyebrow through points [17, 22].
The left eyebrow through points [22, 27].
The right eye using [36, 42].
The left eye with [42, 48].
The nose using [27, 35].
And the jaw via [0, 17].
'''

# FACIAL_LANDMARKS_IDXS = OrderedDict([
# 	("mouth", (48, 68)),
# 	("right_eyebrow", (17, 22)),
# 	("left_eyebrow", (22, 27)),
# 	("right_eye", (36, 42)),
# 	("left_eye", (42, 48)),
# 	("nose", (27, 35)),
# 	("jaw", (0, 17))
# ])


def rect_to_bb(rect):
	# take a bounding predicted by dlib and convert it
	# to the format (x, y, w, h) as we would normally do
	# with OpenCV
	x = rect.left()
	y = rect.top()
	w = rect.right() - x
	h = rect.bottom() - y
 
	# return a tuple of (x, y, w, h)
	return (x, y, w, h)

def shape_to_np(shape, dtype="int"):
	# initialize the list of (x, y)-coordinates
	coords = np.zeros((68, 2), dtype=dtype)
 
	# loop over the 68 facial landmarks and convert them
	# to a 2-tuple of (x, y)-coordinates
	for i in range(0, 68):
		coords[i] = (shape.part(i).x, shape.part(i).y)
 
	# return the list of (x, y)-coordinates
	return coords

# dets, scores, idx = detector.run(img, 1, 0.6) # set threshold to above 0.6
# print("Number of faces detected: {}".format(len(dets)))
# for i, d in enumerate(dets):
# 	print("Detection {} with score {}: Left: {} Top: {} Right: {} Bottom: {}".format(i, scores[i], d.left(), d.top(), d.right(), d.bottom()))
# 	cv2.rectangle(img,(d.left(), d.top()),(d.right(), d.bottom()),(0,255,0),2)
# 	cv2.imshow('img',img)
# show the output image with the face detections + facial landmarks

def get_landmarks(gray):

	rects = detector(gray, 1)

	# loop over the face detections
	for (i, rect) in enumerate(rects):
		# determine the facial landmarks for the face region, then
		# convert the facial landmark (x, y)-coordinates to a NumPy
		# array
		shape = predictor(gray, rect)
		shape = shape_to_np(shape)

		# convert dlib's rectangle to a OpenCV-style bounding box
		# [i.e., (x, y, w, h)], then draw the face bounding box
		# (x, y, w, h) = rect_to_bb(rect)
		# cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
	 
		# # show the face number
		# cv2.putText(image, "Face #{}".format(i + 1), (x - 10, y - 10),
		# 	cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
	 
		# loop over the (x, y)-coordinates for the facial landmarks
		# and draw them on the image
		# for (x, y) in shape:
		# 	cv2.circle(image, (x, y), 1, (0, 0, 255), -1)

		# cv2.imshow("Output", image)
		# cv2.imwrite('output.png', image)

		# cv2.waitKey(0)
		# cv2.destroyAllWindows()
		return shape

def get_distance(shape, moles):
	
	distances = {}
	# TODO: store and return four distance between mole and landmarks
	for i in xrange(len(moles)):

		dist_40 = np.sqrt((moles[i][0] - shape[40][0])**2 + (moles[i][1] - shape[40][1])**2)
		dist_43 = np.sqrt((moles[i][0] - shape[43][0])**2 + (moles[i][1] - shape[43][1])**2)
		distances[moles[i]] = [dist_40, dist_43]
	print(distances)
	return distances

def match(distances1, distances2, ratio):
	mole_pairs = {}
	for mole1, dist1 in distances1.iteritems():
		for mole2, dist2 in distances2.iteritems():
			
			print(mole1)
			print(mole2)
			
			print(dist2)
			dist1 = [dist1[0] * ratio, dist1[1] * ratio]
			print(dist1)
			# print(dist2)
			if np.isclose(dist1, dist2, atol=10).all():
				mole_pairs[mole1] = mole2
				del(distances2[mole2])
				break

	return mole_pairs
	
moles1 = [(608, 508), (652, 568), (806, 517)]
moles2 = [(565, 498), (605, 557), (756, 508)]
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("./shape_predictor_68_face_landmarks.dat")
image1 = cv2.imread("./../log/test1.png")
gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
image2 = cv2.imread("./../log/test2.png")
gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)
shape1 = get_landmarks(gray1)
shape2 = get_landmarks(gray2)
distances1 = get_distance(shape1, moles1)
distances2 = get_distance(shape2, moles2)

land_mark_dist1 = np.sqrt((shape1[40][0] - shape1[43][0])**2 + (shape1[40][1] - shape1[43][1])**2)
land_mark_dist2 = np.sqrt((shape2[40][0] - shape2[43][0])**2 + (shape2[40][1] - shape2[43][1])**2)
print("here: ")
print(land_mark_dist1, land_mark_dist2)
ratio = land_mark_dist1 / land_mark_dist2

mole_pairs = match(distances1, distances2, ratio)
print(mole_pairs)
color = 255
for m1, m2 in mole_pairs.iteritems():
	cv2.circle(image1, (m1[0], m1[1]), 1, (0, 0, color), -1)
	cv2.circle(image2, (m2[0], m2[1]), 1, (0, 0, color), -1)
	color -= 85
cv2.imshow("Output1", image1)
cv2.imwrite('output1.png', image1)
cv2.imshow("Output2", image2)
cv2.imwrite('output2.png', image2)

cv2.waitKey(0)
cv2.destroyAllWindows()




