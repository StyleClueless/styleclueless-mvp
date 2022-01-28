

import os
import socket
from rembg.bg import remove
import numpy as np
import io
from PIL import Image

from flask import Flask


app = Flask(__name__)


@app.route('/')
def hello():
    return 'Hello Container World! I have been seen %s times and my hostname is %s.\n' % ("")
    f = np.fromfile(input_path)
    result = remove(f)
    img = Image.open(io.BytesIO(result)).convert("RGBA")
    img.save(output_path)
