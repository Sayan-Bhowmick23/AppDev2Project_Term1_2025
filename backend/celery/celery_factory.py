from flask import Flask
from celery import Celery, Task
from celery.schedules import crontab

class CeleryConfig():
    broker_url = "redis://localhost:6379/0"
    result_backend = "redis://localhost:6379/1"
    timezone = "Asia/Kolkata"

def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(CeleryConfig)
    celery_app.set_default()

    # # Add periodic task schedules here
    # celery_app.conf.beat_schedule = {
    #     # Daily reminders at 6 PM IST (18:00)
    #     'send-daily-reminders': {
    #         'task': 'tasks.send_daily_reminders',
    #         'schedule': crontab(hour=18, minute=0),  # Adjust timezone if needed
    #     },
    #     # Monthly reports on the first day of every month at midnight (00:00)
    #     'send-monthly-reports': {
    #         'task': 'tasks.send_monthly_reports',
    #         'schedule': crontab(hour=0, minute=0, day_of_month=1),
    #     },
    # }

    app.extensions["celery"] = celery_app
    return celery_app