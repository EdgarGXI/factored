# Base image with Python for backend
FROM python:3.12-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    supervisor \
    nginx \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/ ./backend/
COPY supervisord.conf /etc/supervisor/conf.d/

# Install backend dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy frontend files
COPY frontend/ ./frontend/

# Install and build frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Configure nginx
RUN rm /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port for the application
EXPOSE 80

# Start supervisor to manage both processes
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]