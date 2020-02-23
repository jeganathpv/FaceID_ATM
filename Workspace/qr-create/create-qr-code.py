# Import QRCode from pyqrcode 
import pyqrcode 
from pyqrcode import QRCode 


# String which represent the QR code 
s = "Test Code"

# Generate QR code 
url = QRCode(s)

# Create and save the png file naming "myqr.png" 
# url.svg("myqr.png", scale = 32) 
url.png("myqr.png",scale=8)
