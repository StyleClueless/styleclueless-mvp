FROM python:3.8.5-slim-buster
RUN mkdir /removebg
WORKDIR /removebg
COPY requirements.txt /removebg
RUN pip install -r requirements.txt
COPY . /removebg
ENTRYPOINT ["python"]
CMD ["flask_server.py"]
