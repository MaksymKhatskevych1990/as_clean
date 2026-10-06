#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/clean"
VENV="$BACKEND/.venv"
BACKEND_PID=""
FRONTEND_PID=""
NGROK_PID=""

cleanup() {
  if [[ -n "${NGROK_PID}" ]] && kill -0 "$NGROK_PID" 2>/dev/null; then
    kill "$NGROK_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID}" ]] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${BACKEND_PID}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

wait_for_port() {
  local port="$1"
  local tries=40
  while (( tries > 0 )); do
    if command -v ss >/dev/null 2>&1 && ss -lntn "sport = :${port}" 2>/dev/null | grep -q ":${port}"; then
      return 0
    fi
    if command -v nc >/dev/null 2>&1 && nc -z 127.0.0.1 "$port" >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.25
    tries=$((tries - 1))
  done
  return 1
}

ngrok_url() {
  curl -fsS http://127.0.0.1:4040/api/tunnels 2>/dev/null \
    | python3 -c "import json,sys; tunnels=json.load(sys.stdin).get('tunnels',[]);
print(next((t.get('public_url','') for t in tunnels if t.get('public_url','').startswith('https://')), tunnels[0].get('public_url','') if tunnels else ''))" \
    2>/dev/null || true
}

if [[ ! -x "$VENV/bin/python" ]]; then
  python3 -m venv "$VENV"
fi

"$VENV/bin/pip" install -q -r "$BACKEND/requirements.txt"
"$VENV/bin/python" "$BACKEND/manage.py" migrate --noinput
if ! "$VENV/bin/python" "$BACKEND/manage.py" shell -c "from cms.models import NavLink; raise SystemExit(0 if NavLink.objects.exists() else 1)" >/dev/null 2>&1; then
  "$VENV/bin/python" "$BACKEND/manage.py" seed_site
fi

if [[ ! -d "$FRONTEND/node_modules" ]]; then
  (cd "$FRONTEND" && npm install)
fi

DJANGO_RUNSERVER_HIDE_WARNING=true "$VENV/bin/python" "$BACKEND/manage.py" runserver 127.0.0.1:8000 &
BACKEND_PID=$!

(cd "$FRONTEND" && npm run dev -- --host --port 5173) &
FRONTEND_PID=$!

echo
echo "Сайт:    http://localhost:5173/"
echo "Адмінка: http://127.0.0.1:8000/as_admin/"

if command -v ngrok >/dev/null 2>&1; then
  if ! wait_for_port 5173; then
    echo "ngrok: порт 5173 не відкрився, тунель не запущено"
  else
    if curl -fsS http://127.0.0.1:4040/api/tunnels >/dev/null 2>&1; then
      PUBLIC_URL="$(ngrok_url)"
    else
      ngrok http 5173 --log=stdout >/tmp/ac-clean-ngrok.log 2>&1 &
      NGROK_PID=$!
      for _ in $(seq 1 40); do
        PUBLIC_URL="$(ngrok_url)"
        if [[ -n "${PUBLIC_URL}" ]]; then
          break
        fi
        sleep 0.25
      done
    fi
    if [[ -n "${PUBLIC_URL:-}" ]]; then
      echo "Ngrok:   ${PUBLIC_URL}"
    else
      echo "ngrok: тунель не вдалося підняти, див. /tmp/ac-clean-ngrok.log"
    fi
  fi
else
  echo "ngrok: не знайдено в PATH (snap install ngrok або https://ngrok.com/download)"
fi

echo "Зупинка: Ctrl+C"
echo

wait
