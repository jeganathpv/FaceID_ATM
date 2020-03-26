# Import QRCode from pyqrcode 
import pyqrcode 
from pyqrcode import QRCode 


# String which represent the QR code 
s = "Jaddu"

# Generate QR code 
url = QRCode(s)

print(url)
# Create and save the png file naming "myqr.png" 
url.svg("myqrcode.svg", scale = 8 ,background='#fff') 
# url.png("myqr.png",scale=8)
