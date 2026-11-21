import logging
import smtplib
from email.message import EmailMessage
from typing import Protocol

from certinova_api.log import log_fields

logger = logging.getLogger(__name__)


class Mailer(Protocol):
    def send(self, message: EmailMessage) -> None: ...


class SmtpMailer:
    def __init__(
        self, host: str, port: int, username: str, password: str, starttls: bool = True
    ) -> None:
        self._host = host
        self._port = port
        self._username = username
        self._password = password
        self._starttls = starttls

    def send(self, message: EmailMessage) -> None:
        with smtplib.SMTP(self._host, self._port, timeout=30) as smtp:
            if self._starttls:
                smtp.starttls()
            if self._username:
                smtp.login(self._username, self._password)
            smtp.send_message(message)


class LogMailer:
    """Local development: log emails instead of sending them."""

    def send(self, message: EmailMessage) -> None:
        body = message.get_body(("plain",))
        logger.info(
            "email not sent (no SMTP configured)",
            extra=log_fields(
                to=message["To"],
                subject=message["Subject"],
                text=body.get_content() if body else "",
            ),
        )
