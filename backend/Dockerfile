# Use official Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y netcat-openbsd && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy only requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . /app

# Create necessary directories for static and media
RUN mkdir -p /app/static /app/media

# Expose the port Django will run on
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
