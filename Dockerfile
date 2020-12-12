FROM python:3.9

WORKDIR /code/

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .