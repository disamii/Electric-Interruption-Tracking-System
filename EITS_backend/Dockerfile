FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    binutils \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    build-essential \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# FIX: Create symlink so Django finds libgdal.so where it expects it
RUN ln -s /usr/lib/$(uname -m)-linux-gnu/libgdal.so /usr/lib/libgdal.so

COPY requirements.txt .

# Install GDAL Python bindings matching the system version
RUN pip install --upgrade pip setuptools wheel && \
    pip install GDAL==$(gdal-config --version) && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["bash", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
