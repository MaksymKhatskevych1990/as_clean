# Backend (Django)

Адмінка контенту, SEO і заявок. Форма з сайту зберігається в БД і за наявності налаштувань іде в Telegram.

## Запуск

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_site
python manage.py runserver
```

Адмінка: http://127.0.0.1:8000/admin/  
Логін після `seed_site` (лише в DEBUG): `admin` / `admin`

## Деплой

Сайт і адмінка збираються в один контейнер: фронт у `dist`, Django роздає його через WhiteNoise.

```bash
cp .env.example .env
# заповніть DJANGO_SECRET_KEY, DJANGO_ALLOWED_HOSTS, SITE_URL
docker compose up --build -d
docker compose exec web python manage.py createsuperuser
```

Після старту відкрийте `/admin/`, додайте телефон, email і соцмережі. Телефон на сайті з’явиться лише коли поле заповнене.

## Telegram

У адмінці відкрийте **Telegram**: увімкніть відправку, вкажіть токен бота і chat id. Заявки з форми підуть туди, фото — окремими повідомленнями.

## SEO

Поля title, description, robots, canonical, Open Graph і Twitter заповнюються в **SEO**. У HTML залишаються службові теги: charset, viewport, favicon, шрифти.
