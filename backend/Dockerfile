FROM python:3.9

WORKDIR /usr/src/backend

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV SECRET_KEY=n3(ks_o_i2^911y16a)v11f#=j@=eof(3^6o$a6k^f%n_*83ug
ENV DEBUG=1
ENV ALLOWED_HOSTS=floppshop.herokuapp.com
ENV FRONTEND_HOST=localhost:3000

ENV EMAIL_HOST_USER=floppshop.confirmation@gmail.com
ENV EMAIL_HOST_PASSWOR =FloppShop123
ENV DEFAULT_FROM_EMAIL=sellmmo.confirmation@gmail.com

ENV MERCHANT_POS_ID=402260
ENV CLIENT_SECRET=8c68ebf4951fa46b8951ef1d3609ffdb

ENV DB_HOST=ec2-54-155-226-153.eu-west-1.compute.amazonaws.com
ENV DB_NAME=d9354ghummp0fu
ENV DB_USER=svqlnmhrxjvidk
ENV DB_PASSWORD=cd86e54184d8b1ee49de015a7ccdd4089e2dfda1e30ac765c26dc3098360baaf
ENV DB_PORT=5432

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN python manage.py collectstatic

CMD ["gunicorn", "floppshopproject.wsgi", "--bind", "0.0.0.0:8000", "--reload"]
