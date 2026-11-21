import uuid
from email.message import EmailMessage


class FakeStorage:
    def __init__(self) -> None:
        self.objects: dict[tuple[str, str], bytes] = {}

    def download(self, bucket: str, path: str) -> bytes:
        return self.objects[(bucket, path)]

    def upload(self, bucket: str, path: str, data: bytes, content_type: str) -> None:
        self.objects[(bucket, path)] = data

    def signed_url(self, bucket: str, path: str, expires_in: int) -> str:
        return f"https://storage.test/{bucket}/{path}?expires_in={expires_in}"


class FakeQueue:
    def __init__(self) -> None:
        self.enqueued: list[tuple[str, uuid.UUID]] = []

    def enqueue(self, task: str, job_id: uuid.UUID) -> None:
        self.enqueued.append((task, job_id))


class FakeMailer:
    def __init__(self) -> None:
        self.sent: list[EmailMessage] = []
        self.fail_for: set[str] = set()

    def send(self, message: EmailMessage) -> None:
        if message["To"] in self.fail_for:
            raise ConnectionError("mailbox unavailable")
        self.sent.append(message)
