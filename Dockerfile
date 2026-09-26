FROM node:22-alpine AS frontend
WORKDIR /frontend
COPY clean/package.json clean/package-lock.json ./
RUN npm ci
COPY clean/ ./
RUN npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_DEBUG=0 \
    FRONTEND_DIST=/app/frontend/dist
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libjpeg62-turbo zlib1g \
    && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt
COPY backend /app/backend
COPY --from=frontend /frontend/dist /app/frontend/dist
COPY deploy/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
WORKDIR /app/backend
EXPOSE 8000
CMD ["/app/entrypoint.sh"]
