#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PORT="${PORT:-5173}"

for node_dir in "$HOME/.local"/node-v*-darwin-arm64 "$HOME/.local"/node-v*-darwin-x64; do
  if [ -d "$node_dir/bin" ]; then
    export PATH="$node_dir/bin:$PATH"
    break
  fi
done

if ! command -v ngrok >/dev/null 2>&1; then
  if [ -x "$PROJECT_ROOT/ngrok" ]; then
    export PATH="$PROJECT_ROOT:$PATH"
  fi
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm не найден. Установите Node.js."
  exit 1
fi

if ! command -v ngrok >/dev/null 2>&1; then
  echo "ngrok не найден. Положите бинарник в $PROJECT_ROOT/ngrok"
  exit 1
fi

if ! ngrok config check >/dev/null 2>&1; then
  echo "ngrok не настроен. Выполните один раз:"
  echo "  ngrok config add-authtoken ВАШ_ТОКЕН"
  echo "Токен: https://dashboard.ngrok.com/get-started/your-authtoken"
  exit 1
fi

echo "Запуск сайта на порту $PORT..."
npm run dev:host &
DEV_PID=$!

cleanup() {
  if ps -p "$DEV_PID" > /dev/null 2>&1; then
    kill "$DEV_PID" || true
  fi
}

trap cleanup EXIT INT TERM

sleep 2
echo "Запуск ngrok для http://localhost:$PORT ..."
ngrok http "$PORT"
