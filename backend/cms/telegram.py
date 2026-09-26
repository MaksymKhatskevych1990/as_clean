import logging
from pathlib import Path

import requests

from .models import Booking, TelegramSettings

logger = logging.getLogger(__name__)


def format_booking_message(booking: Booking) -> str:
    comment = booking.comment.strip() or '—'
    return (
        'Нова заявка на прибирання\n\n'
        f'Імʼя: {booking.name}\n'
        f'Телефон: {booking.phone}\n'
        f'Email: {booking.email}\n'
        f'Адреса: {booking.address}\n'
        f'Тип приміщення: {booking.property_type}\n'
        f'Площа: {booking.area} м²\n'
        f'Вид прибирання: {booking.cleaning_type}\n'
        f'Дата: {booking.date}\n'
        f'Час: {booking.time}\n'
        f'Коментар: {comment}'
    )


def notify_telegram(booking: Booking) -> None:
    settings = TelegramSettings.load()
    if not settings.is_enabled:
        return
    if not settings.bot_token or not settings.chat_id:
        booking.telegram_error = 'Telegram увімкнено, але не заповнені токен або chat id'
        booking.save(update_fields=['telegram_error'])
        return

    base = f'https://api.telegram.org/bot{settings.bot_token}'
    try:
        response = requests.post(
            f'{base}/sendMessage',
            json={'chat_id': settings.chat_id, 'text': format_booking_message(booking)},
            timeout=15,
        )
        response.raise_for_status()
        payload = response.json()
        if not payload.get('ok'):
            raise RuntimeError(payload.get('description') or 'Telegram API error')

        for photo in booking.photos.all():
            path = Path(photo.image.path)
            with path.open('rb') as handle:
                photo_response = requests.post(
                    f'{base}/sendPhoto',
                    data={'chat_id': settings.chat_id},
                    files={'photo': (path.name, handle)},
                    timeout=30,
                )
                photo_response.raise_for_status()

        booking.telegram_sent = True
        booking.telegram_error = ''
        booking.save(update_fields=['telegram_sent', 'telegram_error'])
    except Exception as exc:
        logger.exception('Failed to send booking %s to Telegram', booking.pk)
        booking.telegram_sent = False
        booking.telegram_error = str(exc)
        booking.save(update_fields=['telegram_sent', 'telegram_error'])
