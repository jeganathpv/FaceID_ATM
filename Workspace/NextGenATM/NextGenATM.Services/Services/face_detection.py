
import face_recognition 
from PIL import Image
import base64

class FaceDetection:
    #Count no. of faces found in image
    @staticmethod
    def locateFacesInImage(img):
        image = face_recognition.load_image_file(img)
        faceLocation = face_recognition.face_locations(image)
        return len(faceLocation)

    #To save file from the string
    @staticmethod
    def saveFile(image_in_str,mode):
        if mode == "enroll":
            path = "../StorageHub/Enroll/image.jpg"
        elif mode == "testing":
            path = "../StorageHub/Testing/test.jpg"
        img = open(path,'wb')
        img.write(base64.b64decode(image_in_str))
        img.close()
        return path