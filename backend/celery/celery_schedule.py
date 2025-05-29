from celery.schedules import crontab
from flask import current_app as app

from backend.celery.tasks import send_daily_reminders, send_monthly_reports

# from backend.celery.tasks import daily_reminder, monthly_reminder

celery_app = app.extensions["celery"]

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # # for testing
    # sender.add_periodic_task(
    #     crontab(hour=20, minute=14, day_of_week="Wednesday"),
    #     daily_reminder.s("student@example",
    #                      "reminder to attempt the quiz",
    #                      "<h1>Hello, pls attempt the new quiz</h1>"
    #                     ), name="Weekly Reminder"
    # )

    # # Monthly Reminder on every 1st day of every month at 10:00 a.m.
    # sender.add_periodic_task(
    #     crontab(hour=10, minute=00, day_of_week=1 ,day_of_month=1),
    #     monthly_reminder.s("student@example",
    #                      "reminder to attempt the quiz",
    #                      "<h1>Hello, pls attempt the new quiz</h1>"
    #                      ), name="Monthly Reminder"
    # )

    # Schedule the daily reminder task to run every day at 9:00 AM IST
    sender.add_periodic_task(
        crontab(hour=11, minute=16),
        send_daily_reminders.s(),
        name="daily_reminder_emails",
    )
    # Schedule the monthly reminder to run every month's 1st day
    sender.add_periodic_task(
        crontab(hour=11, minute=16, day_of_month=28),
        send_monthly_reports.s(),
        name="monthly_reminder_emails",
    )