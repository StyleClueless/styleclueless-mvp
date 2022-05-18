FROM python:3.8.5-slim-buster
RUN mkdir /removebg
WORKDIR /removebg
COPY requirements.txt /removebg
COPY downloadModel.sh /removebg
RUN chmod +x downloadModel.sh
RUN ./downloadModel.sh
COPY u2net.onnx $HOME/.u2net/

RUN pip install -r requirements.txt
COPY . /removebg
ENTRYPOINT ["python"]
CMD ["flask_server.py"]
