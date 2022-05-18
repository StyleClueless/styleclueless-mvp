FROM python:3.8.5-slim-buster
RUN mkdir /removebg
WORKDIR /removebg
COPY requirements.txt /removebg
#COPY downloadModel.sh /removebg
#RUN apt update
#RUN apt install -y wget
#RUN chmod +x downloadModel.sh
#RUN echo $HOME
#
#RUN mkdir $HOME/.u2net/
#RUN ./downloadModel.sh

#COPY u2net.onnx $HOME/.u2net/

RUN pip install -r requirements.txt
RUN python ./downloadModel.py
COPY . /removebg
ENTRYPOINT ["python"]
CMD ["flask_server.py"]
