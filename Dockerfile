FROM python:3.8
WORKDIR /app
COPY ./backend .
COPY requirements.txt .
RUN pip install -r requirements.txt
EXPOSE 8000
