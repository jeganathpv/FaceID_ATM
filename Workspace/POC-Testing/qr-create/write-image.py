from PIL import Image, ImageDraw, ImageFont
 
img = Image.open('qr_resized.png','r')

numberfont = ImageFont.truetype('Roboto-Medium.ttf', 28)
namefont = ImageFont.truetype('Roboto-Bold.ttf', 25)
d = ImageDraw.Draw(img)
#Name
d.text((28,321), "Jaddu",  font=namefont, fill=(255,255,255))
#AC Number
d.text((28,242), "1090026",  font=numberfont, fill=(255,255,255))
 
img.save('pil_text.png')