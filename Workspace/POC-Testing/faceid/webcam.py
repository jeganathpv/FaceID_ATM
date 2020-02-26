import cv2
import os 
import face_recognition



def cam_data():
    cam = cv2.VideoCapture(0)
    cv2.namedWindow("test")
    img_counter = 0
    while True:
        ret, frame = cam.read()
        cv2.imshow("test", frame)
        if not ret:
            break
        k = cv2.waitKey(1)
        if k % 256 == 32:
            # SPACE pressed
            # image = face_recognition.load_image_file(frame)
            # face_locations = face_recognition.face_locations(image)
            # print("I found {} face(s) in this photograph.".format(len(face_locations)))
            img_name = "opencv_frame_{}.png".format(img_counter)
            cv2.imwrite('./camera/' + img_name, frame)
            print("{} written!".format(img_name))
            img_counter += 1
            break
    cam.release()
    # cv2.destroyAllWindows()
    # testset_code('/camera')

cam_data()