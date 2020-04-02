from pyqrcode import QRCode
import cairosvg
from PIL import Image, ImageDraw, ImageFont
import base64

# from Models import *


class HandleException:
    @staticmethod
    def exceptionHandler(e):
        if hasattr(e, 'message'):
            print(e.message)
        else:
            print(e)


class DataMassager:
    @staticmethod
    def massageDataDocument(object):
        del object['_id']
        return object


class QRCardGenerator:
    @staticmethod
    def generateQrCard(customerObject):
        try:
            qrCode = QRCode(customerObject.customerID)
            qrCode.svg("backup/qr/{}.svg".format(customerObject.customerID),
                       scale=8, background='#fff')
            # Convert SVG to PNG
            cairosvg.svg2png(url="backup/qr/{}.svg".format(customerObject.customerID),
                             write_to="backup/qr/{}.png".format(customerObject.customerID))
            qrCode = Image.open(
                "backup/qr/{}.png".format(customerObject.customerID))
            qrCode = qrCode.resize((177, 177))
            qrCard = Image.open('assets/qr_template.png')
            # Paste QR Code in Card
            # Co-Ordinates are calculated from Card Image
            qrCard.paste(qrCode, (401, 171))
            # qrCard.save("backup/card/{}.png".format(customerObject.customerID))

            # Load Required fonts with size
            numberFont = ImageFont.truetype('assets/Roboto-Medium.ttf', 28)
            nameFont = ImageFont.truetype('assets/Roboto-Bold.ttf', 25)
            writeCard = ImageDraw.Draw(qrCard)
            # Write Name in Card
            writeCard.text((28, 321), customerObject.name,
                           font=nameFont, fill=(255, 255, 255))
            # Write Account in Card
            writeCard.text((28, 242), customerObject.accountNo,
                           font=numberFont, fill=(255, 255, 255))
            qrCard.save("backup/card/{}.png".format(customerObject.customerID))
            return True
        except Exception as e:
            HandleException.exceptionHandler(e)


class ImageToB64:
    @staticmethod
    def getBase64String(path):
        with open(path, "rb") as img_file:
            base64String = base64.b64encode(img_file.read())
        return base64String
