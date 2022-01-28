#codin:utf8
import datetime
import traceback
import time
import colors
import time
from flask import Flask,request,jsonify, g, request
from rfc3339 import rfc3339
import os

import socket
from rembg.bg import remove
import numpy as np
import io
from PIL import Image
from io import BytesIO
import base64
import re
import json
FLASK_APP = 'removebg'

app = Flask(__name__)




def timing(f):
    def wrap(*args):
        time1 = time.time()
        ret = f(*args)
        time2 = time.time()
        print('{:s} function took {:.3f} ms'.format(f.__name__, (time2-time1)*1000.0))
        return ret
    return wrap


@app.route('/removebg/', methods=['post'])
def handler():

    try:
        im = Image.open(BytesIO(request.get_data())) # under request data as binary
        filename=str(time.time()) + "tmp.png";
        im.save(filename, "PNG")
        I=np.fromfile(filename);
        result = remove(I)
        img = Image.open(io.BytesIO(result)).convert("RGBA")
        result={}
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue())
        result['image'] =img_str.decode('utf-8')
        os.remove(filename)
        return jsonify(result)

    except Exception:
        app.logger.error("HERE=>"+traceback.format_exc())
        return jsonify({"codes": []})



@app.before_request
def start_timer():
    g.start = time.time()


@app.after_request
def log_request(response):
    try:
        if request.path == '/favicon.ico':
            return response
        elif request.path.startswith('/static'):
            return response

        now = time.time()
        duration = round(now - g.start, 2)
        dt = datetime.datetime.fromtimestamp(now)
        timestamp = rfc3339(dt, utc=True)

        ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        host = request.host.split(':', 1)[0]
        args = dict(request.args)
        results = response.get_data()
        log_params = [
            ('method', request.method, 'blue'),
            ('path', request.path, 'blue'),
            ('status', response.status_code, 'yellow'),
            ('duration', duration, 'green'),
            ('time', timestamp, 'magenta'),
            ('ip', ip, 'red'),
            ('host', host, 'red'),
            ('params', args, 'blue'),
            ('result', results, 'yellow')
        ]

        request_id = request.headers.get('X-Request-ID')
        if request_id:
            log_params.append(('request_id', request_id, 'yellow'))

        parts = []
        for name, value, color in log_params:
            part = colors.color("{}={}".format(name, value), fg=color)
            parts.append(part)
        line = " ".join(parts)

        app.logger.info(line)

        return response
    except Exception:
        print(traceback.format_exc())

if __name__ == '__main__':
    try:
        app.debug = True


        app.run(host='0.0.0.0', port=os.getenv('FLASK_PORT', '3000'),  threaded=True)

    except Exception:
        print(traceback.format_exc())
