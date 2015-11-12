import sys, os
import fnmatch
import json
import re

dictionaries_folder = 'src/main/java/com/lorepo/icplayer/public/libs/dictionaries'

for root, dirnames, filenames in os.walk(dictionaries_folder):
    for filename in fnmatch.filter(filenames, '*.js'):
        file_src = os.path.join(root, filename)

        print '*', file_src

        with open(file_src, 'r') as file_source:
            data = re.sub('.*{', '{', file_source.read().replace(';', ''))
            json.loads(data)