import os 

path = "./training_data"

files = []
for entries in os.listdir(path):
        files.append(os.path.join(path,entries))

for f in files:
    print(f)

# print()