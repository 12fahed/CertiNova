import uuid
from typing import Protocol

from redis import Redis
from rq import Queue

TASKS_MODULE = "certinova_api.worker.tasks"


class JobQueue(Protocol):
    def enqueue(self, task: str, job_id: uuid.UUID) -> None: ...


class RqJobQueue:
    """Puts a job id on Redis. The worker loads everything else from the jobs table."""

    def __init__(self, redis_url: str, queue_name: str, job_timeout: int = 3600) -> None:
        self._queue = Queue(
            queue_name, connection=Redis.from_url(redis_url), default_timeout=job_timeout
        )

    def enqueue(self, task: str, job_id: uuid.UUID) -> None:
        self._queue.enqueue(f"{TASKS_MODULE}.{task}", str(job_id), job_id=str(job_id))
