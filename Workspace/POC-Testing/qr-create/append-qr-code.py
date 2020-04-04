from PIL import Image
img = Image.open('myqrcode.png')
# img.
img = img.resize((177,177))
qrcard = Image.open('qr_resized.png')
qrcard.paste(img, (401,171))
print(qrcard)
qrcard.save('out.png')


#top l(401,170) r(401,347)
#bottom l(578,170) r(578,170)