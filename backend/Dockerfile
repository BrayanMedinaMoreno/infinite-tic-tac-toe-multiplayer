FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# We'll run server via docker-compose command, but provide a default
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]
