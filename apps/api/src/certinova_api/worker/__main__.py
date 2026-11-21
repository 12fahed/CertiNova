"""Run the worker: python -m certinova_api.worker [--burst]"""

import sys

from redis import Redis
from rq import Worker

from certinova_api.config import get_settings
from certinova_api.log import configure_logging


def main() -> None:
    settings = get_settings()
    configure_logging(settings.log_level)
    worker = Worker([settings.queue_name], connection=Redis.from_url(settings.redis_url))
    worker.work(burst="--burst" in sys.argv[1:], logging_level=settings.log_level)


if __name__ == "__main__":
    main()
