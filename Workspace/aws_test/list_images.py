import os 

def populate_files(path):
    files = []
    for entries in os.listdir(path):
        files.append(os.path.join(path,entries))
    return files
