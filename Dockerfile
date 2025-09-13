# Backend: Python
FROM python:3.11-slim AS python-backend
WORKDIR /app
COPY medical_system/ /app/medical_system/
COPY requirements.txt .
RUN pip install -r requirements.txt

# Backend: Node
FROM node:20 AS node-backend
WORKDIR /app
COPY backend/ /app/backend/
RUN cd backend && npm install

# Final image
FROM python:3.11-slim
WORKDIR /app

# Copy Python backend
COPY --from=python-backend /app /app

# Copy Node backend
COPY --from=node-backend /app/backend /app/backend

EXPOSE 8000

# Start both services (Python + Node)
CMD ["sh", "-c", "gunicorn medical_system.wsgi:application --bind 0.0.0.0:8000 & cd backend && npm start"]
